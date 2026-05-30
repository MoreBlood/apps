#!/usr/bin/env node
/**
 * Pre-commit: TypeScript, Biome, Lighthouse baseline guard.
 * Skip Lighthouse: SKIP_LIGHTHOUSE=1 git commit ...
 */
import { spawnSync } from 'node:child_process'

/** @param {string} label @param {string[]} args */
function run(label, args) {
	console.log(`\n▶ ${label}`)
	const result = spawnSync(args[0], args.slice(1), {
		stdio: 'inherit',
		shell: false,
		env: process.env
	})
	if (result.status !== 0) {
		process.exit(result.status ?? 1)
	}
}

console.log('pre-commit checks…')

run('TypeScript (tsc --noEmit)', ['npx', 'tsc', '--noEmit'])

const staged = spawnSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR'], {
	encoding: 'utf8'
})
const hasStaged = staged.stdout?.trim().length > 0
if (hasStaged) {
	run('Biome (staged files)', ['npm', 'run', 'lint:staged'])
} else {
	console.log('\n⊙ Biome skipped (no staged files)')
}

if (process.env.SKIP_LIGHTHOUSE === '1') {
	console.log('\n⊙ Lighthouse compare skipped (SKIP_LIGHTHOUSE=1)')
} else {
	run('Lighthouse (vs baseline)', ['node', 'scripts/lighthouse-compare.mjs'])
}

console.log('\n✓ pre-commit passed')
