import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Absolute path to packages/shared (this package root). */
export const sharedRoot = __dirname

/** Webpack/Turbopack alias so `@/` resolves to packages/shared from app routes. */
export function withSharedAlias(config) {
	config.resolve.alias['@'] = sharedRoot
	config.module.rules.push({
		test: /styles\/critical\/.+\.css$/,
		type: 'asset/source'
	})
	return config
}
