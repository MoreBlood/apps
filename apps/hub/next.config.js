/** @type {import('next').NextConfig} */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { withSharedAlias } from '../../packages/shared/next-alias.mjs'

const getBasePath = () => {
	const explicit = process.env.BASE_PATH?.trim()
	if (explicit) {
		return explicit.startsWith('/') ? explicit : `/${explicit}`
	}

	if (process.env.GITHUB_REPOSITORY) {
		const repoName = process.env.GITHUB_REPOSITORY.split('/')[1]
		if (repoName.endsWith('.github.io')) {
			return ''
		}
		if (repoName === 'apps') {
			return '/apps'
		}
		return `/${repoName}`
	}

	return ''
}

const basePath = getBasePath()

const nextConfig = {
	experimental: {
		externalDir: true,
		optimizePackageImports: ['@radix-ui/themes', '@radix-ui/react-icons'],
		optimizeCss: true
	},
	output: 'export',
	...(basePath && { basePath }),
	...(basePath && { assetPrefix: basePath }),
	env: {
		NEXT_PUBLIC_BASE_PATH: basePath
	},
	trailingSlash: true,
	images: {
		unoptimized: true,
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
