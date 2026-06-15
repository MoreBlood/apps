/** @type {import('next').NextConfig} */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { withSharedAlias } from '../../packages/shared/next-alias.mjs'

const nextConfig = {
	experimental: {
		externalDir: true,
		optimizePackageImports: ['@radix-ui/themes', '@radix-ui/react-icons'],
		optimizeCss: true
	},
	env: {
		NEXT_PUBLIC_SITE_MODE: 'single-app',
		NEXT_PUBLIC_SINGLE_APP_SLUG: 'rawclinic',
		NEXT_PUBLIC_FEEDBACK_API_PATH: '/api/feedback'
	},
	trailingSlash: true,
	images: {
		formats: ['image/webp']
	},
	turbopack: {
		resolveAlias: {
			'@': path.join(path.dirname(fileURLToPath(import.meta.url)), '../../packages/shared')
		}
	},
	webpack: withSharedAlias
}

export default nextConfig
