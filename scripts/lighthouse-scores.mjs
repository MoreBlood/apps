#!/usr/bin/env node
/**
 * Aggregated Lighthouse scores (committed). Full LH JSON → lighthouse-reports/.cache/ (gitignored).
 */
import fs from 'node:fs'
import path from 'node:path'

export const LIGHTHOUSE_DIR = path.resolve('lighthouse-reports')
export const LIGHTHOUSE_CACHE_DIR = path.join(LIGHTHOUSE_DIR, '.cache')
export const SCORES_PATH = path.join(LIGHTHOUSE_DIR, 'scores.json')
export const BASELINE_PATH = path.join(LIGHTHOUSE_DIR, 'scores.baseline.json')

/** @typedef {'performance' | 'accessibility' | 'best-practices' | 'seo'} LighthouseCategory */

export const LIGHTHOUSE_ROUTES = [
	{ name: 'home', path: '/' },
	{ name: 'rawclinic', path: '/rawclinic/' },
	{ name: 'aqi-sense', path: '/aqi-sense/' },
	{ name: 'faq', path: '/faq/' },
	{ name: 'rawclinic-faq', path: '/rawclinic/faq/' },
	{ name: 'privacy', path: '/privacy/' }
]

export const LIGHTHOUSE_METRICS = [
	'largest-contentful-paint',
	'first-contentful-paint',
	'speed-index',
	'total-blocking-time',
	'cumulative-layout-shift',
	'interactive'
]

/** @type {LighthouseCategory[]} */
export const LIGHTHOUSE_CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo']

const SCORES_VERSION = 2

/**
 * @param {unknown} report
 */
export function extractLighthouseSnapshot(report) {
	/** @type {Record<string, number>} */
	const scores = {}
	for (const id of LIGHTHOUSE_CATEGORIES) {
		const raw = report?.categories?.[id]?.score
		if (typeof raw === 'number') scores[id] = Math.round(raw * 100)
	}

	/** @type {Record<string, number>} */
	const metrics = {}
	for (const id of LIGHTHOUSE_METRICS) {
		const raw = report?.audits?.[id]?.numericValue
		if (typeof raw === 'number' && Number.isFinite(raw)) {
			metrics[id] = id === 'cumulative-layout-shift' ? Math.round(raw * 1000) / 1000 : Math.round(raw)
		}
	}

	return { scores, metrics }
}

/**
 * @param {ReturnType<typeof extractLighthouseSnapshot>} snapshot
 */
export function normalizePageSnapshot(snapshot) {
	return {
		scores: { ...snapshot.scores },
		metrics: { ...snapshot.metrics }
	}
}

/**
 * @param {Record<string, ReturnType<typeof extractLighthouseSnapshot>>} pages
 * @param {{ baseUrl?: string }} meta
 */
export function buildScoresDocument(pages, meta = {}) {
	/** @type {Record<string, { path: string, scores: Record<string, number>, metrics: Record<string, number> }>} */
	const normalized = {}

	for (const { name, path: routePath } of LIGHTHOUSE_ROUTES) {
		const snap = pages[name]
		if (!snap) continue
		normalized[name] = {
			path: routePath,
			...normalizePageSnapshot(snap)
		}
	}

	return {
		version: SCORES_VERSION,
		updatedAt: new Date().toISOString(),
		baseUrl: meta.baseUrl ?? null,
		pages: normalized
	}
}

/**
 * @param {string} filePath
 */
export function readScoresDocument(filePath) {
	if (!fs.existsSync(filePath)) return null
	return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

/**
 * @param {ReturnType<typeof buildScoresDocument>} doc
 * @param {string} filePath
 */
export function writeScoresDocument(doc, filePath) {
	fs.mkdirSync(path.dirname(filePath), { recursive: true })
	fs.writeFileSync(filePath, `${JSON.stringify(doc, null, 2)}\n`)
}

/**
 * @param {string} cacheDir
 * @param {typeof LIGHTHOUSE_ROUTES} routes
 */
export function loadSnapshotsFromCache(cacheDir, routes = LIGHTHOUSE_ROUTES) {
	/** @type {Record<string, ReturnType<typeof extractLighthouseSnapshot>>} */
	const pages = {}

	for (const { name } of routes) {
		const filePath = path.join(cacheDir, `${name}.json`)
		if (!fs.existsSync(filePath)) continue
		const report = JSON.parse(fs.readFileSync(filePath, 'utf8'))
		pages[name] = extractLighthouseSnapshot(report)
	}

	return pages
}

/** @deprecated Read aggregated scores only. */
export function loadSnapshotsFromReports(reportsDir, routes = LIGHTHOUSE_ROUTES) {
	const pages = {}
	for (const { name } of routes) {
		const filePath = path.join(reportsDir, `${name}.json`)
		if (!fs.existsSync(filePath)) continue
		const report = JSON.parse(fs.readFileSync(filePath, 'utf8'))
		if (report?.categories || report?.audits) {
			pages[name] = extractLighthouseSnapshot(report)
		}
	}
	return pages
}

/**
 * @param {Record<string, { scores?: Record<string, number>, metrics?: Record<string, number> }>} baselinePages
 * @param {Record<string, { scores?: Record<string, number>, metrics?: Record<string, number> }>} currentPages
 * @param {{ scoreTolerance?: number, metricRatio?: number, metricSlackMs?: number }} opts
 */
export function compareScorePages(baselinePages, currentPages, opts = {}) {
	const scoreTolerance = opts.scoreTolerance ?? Number(process.env.LIGHTHOUSE_SCORE_TOLERANCE ?? '0')
	const metricRatio = opts.metricRatio ?? Number(process.env.LIGHTHOUSE_METRIC_RATIO ?? '1.05')
	const metricSlackMs = opts.metricSlackMs ?? Number(process.env.LIGHTHOUSE_METRIC_SLACK_MS ?? '150')

	/** @type {{ page: string, kind: string, message: string }[]} */
	const regressions = []

	for (const { name } of LIGHTHOUSE_ROUTES) {
		const base = baselinePages[name]
		if (!base) continue

		const cur = currentPages[name]
		if (!cur) {
			regressions.push({
				page: name,
				kind: 'missing',
				message: `No entry in scores.json for "${name}"`
			})
			continue
		}

		for (const category of LIGHTHOUSE_CATEGORIES) {
			const b = base.scores?.[category]
			const c = cur.scores?.[category]
			if (typeof b !== 'number' || typeof c !== 'number') continue
			if (c < b - scoreTolerance) {
				regressions.push({
					page: name,
					kind: 'score',
					message: `${category}: ${c} < baseline ${b}`
				})
			}
		}

		for (const metric of LIGHTHOUSE_METRICS) {
			const b = base.metrics?.[metric]
			const c = cur.metrics?.[metric]
			if (typeof b !== 'number' || typeof c !== 'number') continue

			const limit = metric === 'cumulative-layout-shift' ? b * metricRatio + 0.02 : b * metricRatio + metricSlackMs

			if (c > limit) {
				regressions.push({
					page: name,
					kind: 'metric',
					message: `${metric}: ${c} > allowed ${Math.round(limit * 1000) / 1000} (baseline ${b})`
				})
			}
		}
	}

	return regressions
}

/**
 * @param {ReturnType<typeof readScoresDocument>} doc
 */
export function printScoresTable(doc) {
	if (!doc?.pages) return
	console.log('\nPage\tPerf\tA11y\tBP\tSEO\tLCP ms')
	for (const { name } of LIGHTHOUSE_ROUTES) {
		const p = doc.pages[name]
		if (!p) continue
		const s = p.scores ?? {}
		const lcp = p.metrics?.['largest-contentful-paint']
		console.log(
			`${name}\t${s.performance ?? '—'}\t${s.accessibility ?? '—'}\t${s['best-practices'] ?? '—'}\t${s.seo ?? '—'}\t${typeof lcp === 'number' ? lcp : '—'}`
		)
	}
}
