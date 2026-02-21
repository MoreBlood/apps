import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
	test: {
		environment: 'node',
		clearMocks: true,
		restoreMocks: true
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, '.')
		}
	}
})
