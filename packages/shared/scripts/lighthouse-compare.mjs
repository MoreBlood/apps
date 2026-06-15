#!/usr/bin/env node
/**
 * Compare lighthouse-reports/scores.json vs scores.baseline.json
 */
import {
	BASELINE_PATH,
	compareScorePages,
	printScoresTable,
	readScoresDocument,
	SCORES_PATH
} from './lighthouse-scores.mjs'

const baseline = readScoresDocument(BASELINE_PATH)
if (!baseline?.pages) {
	console.error(
		`Missing ${BASELINE_PATH} — run:\n` +
			'  npm run build && npx serve out -l 3456\n' +
			'  npm run lighthouse:audit\n' +
			'  npm run lighthouse:baseline'
	)
	process.exit(1)
}

const current = readScoresDocument(SCORES_PATH)
if (!current?.pages) {
	console.error(`Missing ${SCORES_PATH} — run: npm run lighthouse:audit\n(Or commit an existing scores.json from CI.)`)
	process.exit(1)
}

const regressions = compareScorePages(baseline.pages, current.pages)

if (regressions.length === 0) {
	console.log('Lighthouse: OK (scores.json vs scores.baseline.json)')
	printScoresTable(current)
	process.exit(0)
}

console.error('\nLighthouse regressions (commit blocked):\n')
for (const r of regressions) {
	console.error(`  • [${r.page}] ${r.message}`)
}
console.error(
	`\nRefresh: npm run lighthouse:audit\n` +
		`If intentional: npm run lighthouse:baseline && commit ${BASELINE_PATH} and ${SCORES_PATH}`
)
process.exit(1)
