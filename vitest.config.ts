import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'node',
		clearMocks: true,
		restoreMocks: true
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, 'packages/shared')
		}
	},
	plugins: [
		{
			name: 'critical-css-imports',
			load(id) {
				if (!id.includes('/styles/critical/') || !id.endsWith('.css')) return null
				const css = readFileSync(id, 'utf8').trim()
				return `export default ${JSON.stringify(css)}`
			}
		}
	]
})
