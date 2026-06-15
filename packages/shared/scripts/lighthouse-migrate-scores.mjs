#!/usr/bin/env node
/** One-off: build scores.json + scores.baseline.json from legacy full reports / baseline.json */
import fs from 'node:fs'
import path from 'node:path'
import {
	BASELINE_PATH,
	buildScoresDocument,
	LIGHTHOUSE_DIR,
	loadSnapshotsFromReports,
	readScoresDocument,
	SCORES_PATH,
	writeScoresDocument
} from './lighthouse-scores.mjs'

const legacyBaseline = path.join(LIGHTHOUSE_DIR, 'baseline.json')
const pages = loadSnapshotsFromReports(LIGHTHOUSE_DIR)

if (Object.keys(pages).length === 0 && fs.existsSync(legacyBaseline)) {
	const legacy = readScoresDocument(legacyBaseline)
	if (legacy?.pages) {
		for (const [name, snap] of Object.entries(legacy.pages)) {
			pages[name] = { scores: snap.scores ?? {}, metrics: snap.metrics ?? {} }
		}
	}
}

if (Object.keys(pages).length === 0) {
	console.error('No legacy lighthouse JSON found to migrate.')
	process.exit(1)
}

const doc = buildScoresDocument(pages, { baseUrl: 'http://localhost:3456' })
writeScoresDocument(doc, SCORES_PATH)
writeScoresDocument({ ...doc, promotedAt: doc.updatedAt, baselineOf: SCORES_PATH }, BASELINE_PATH)
console.log(`Wrote ${SCORES_PATH} and ${BASELINE_PATH}`)
