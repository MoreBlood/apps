#!/usr/bin/env node
/**
 * Promote lighthouse-reports/scores.json → scores.baseline.json
 */
import { BASELINE_PATH, readScoresDocument, SCORES_PATH, writeScoresDocument } from './lighthouse-scores.mjs'

const current = readScoresDocument(SCORES_PATH)
if (!current?.pages || Object.keys(current.pages).length === 0) {
	console.error(`Missing or empty ${SCORES_PATH} — run: npm run lighthouse:audit`)
	process.exit(1)
}

const baseline = {
	...current,
	baselineOf: SCORES_PATH,
	promotedAt: new Date().toISOString()
}

writeScoresDocument(baseline, BASELINE_PATH)
console.log(`Wrote ${BASELINE_PATH} (${Object.keys(baseline.pages).length} routes)`)
