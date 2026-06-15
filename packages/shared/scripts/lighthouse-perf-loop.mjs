#!/usr/bin/env node
/**
 * Build, audit /rawclinic/ perf, print score. Exit 0 when perf === 100.
 * Updates lighthouse-reports/scores.json (rawclinic route only).
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import {
	buildScoresDocument,
	extractLighthouseSnapshot,
	LIGHTHOUSE_CACHE_DIR,
	readScoresDocument,
	SCORES_PATH,
	writeScoresDocument
} from './lighthouse-scores.mjs'

const baseUrl = process.env.LIGHTHOUSE_BASE_URL ?? 'http://localhost:3456'
const url = `${baseUrl.replace(/\/$/, '')}/rawclinic/`
const cachePath = path.join(LIGHTHOUSE_CACHE_DIR, 'rawclinic.json')

fs.mkdirSync(LIGHTHOUSE_CACHE_DIR, { recursive: true })

const lh = spawnSync(
	'npx',
	[
		'--yes',
		'lighthouse',
		url,
		'--quiet',
		'--chrome-flags=--headless=new --no-sandbox',
		'--only-categories=performance',
		'--output=json',
		`--output-path=${cachePath}`
	],
	{ encoding: 'utf8' }
)

if (lh.status !== 0) {
	console.error(lh.stderr || lh.stdout)
	process.exit(lh.status ?? 1)
}

const report = JSON.parse(fs.readFileSync(cachePath, 'utf8'))
const snap = extractLighthouseSnapshot(report)
const perf = snap.scores.performance ?? 0
const lcp = report.audits['largest-contentful-paint']?.displayValue
const fcp = report.audits['first-contentful-paint']?.displayValue
const tti = report.audits.interactive?.displayValue

const existing = readScoresDocument(SCORES_PATH)
/** @type {Record<string, ReturnType<typeof extractLighthouseSnapshot>>} */
const pages = {}
if (existing?.pages) {
	for (const [name, page] of Object.entries(existing.pages)) {
		pages[name] = { scores: page.scores ?? {}, metrics: page.metrics ?? {} }
	}
}
pages.rawclinic = snap

writeScoresDocument(buildScoresDocument(pages, { baseUrl }), SCORES_PATH)

console.log(`rawclinic perf: ${perf} | LCP ${lcp} | FCP ${fcp} | TTI ${tti}`)
console.log(`Updated ${SCORES_PATH} (rawclinic only)`)
process.exit(perf >= 100 ? 0 : 1)
