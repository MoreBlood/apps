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
	}
})
