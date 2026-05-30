#!/usr/bin/env node
/**
 * Audits key static routes. Start the export first, e.g.:
 *   npm run build && npx serve out -l 3456
 *
 * Writes:
 *   lighthouse-reports/scores.json          — aggregated (commit this)
 *   lighthouse-reports/.cache/{page}.json   — full LH output (gitignored)
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import {
	buildScoresDocument,
	extractLighthouseSnapshot,
	LIGHTHOUSE_CACHE_DIR,
	LIGHTHOUSE_ROUTES,
	printScoresTable,
	SCORES_PATH,
	writeScoresDocument
} from './lighthouse-scores.mjs'

const baseUrl = process.env.LIGHTHOUSE_BASE_URL ?? 'http://localhost:3456'

fs.mkdirSync(LIGHTHOUSE_CACHE_DIR, { recursive: true })

/** @type {Record<string, ReturnType<typeof extractLighthouseSnapshot>>} */
const pages = {}

for (const { name, path: routePath } of LIGHTHOUSE_ROUTES) {
	const url = `${baseUrl.replace(/\/$/, '')}${routePath}`
	const cachePath = `${LIGHTHOUSE_CACHE_DIR}/${name}.json`
	console.log(`\n→ ${url}`)
	const result = spawnSync(
		'npx',
		[
			'--yes',
			'lighthouse',
			url,
			'--quiet',
			'--chrome-flags=--headless=new --no-sandbox',
			'--only-categories=performance,accessibility,best-practices,seo',
			'--output=json',
			`--output-path=${cachePath}`
		],
		{ stdio: 'inherit' }
	)
	if (result.status !== 0) {
		process.exit(result.status ?? 1)
	}
	const report = JSON.parse(fs.readFileSync(cachePath, 'utf8'))
	pages[name] = extractLighthouseSnapshot(report)
}

const doc = buildScoresDocument(pages, { baseUrl })
writeScoresDocument(doc, SCORES_PATH)
printScoresTable(doc)
console.log(`\nWrote ${SCORES_PATH}`)
