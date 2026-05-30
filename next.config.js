/** @type {import('next').NextConfig} */

const getBasePath = () => {
	const explicit = process.env.BASE_PATH?.trim()
	if (explicit) {
		return explicit.startsWith('/') ? explicit : `/${explicit}`
	}

	if (process.env.GITHUB_REPOSITORY) {
		const repoName = process.env.GITHUB_REPOSITORY.split('/')[1]
		// user.github.io → site root; project repo `apps` → /apps
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
	// WebP + blur are generated at build time (scripts/generate-image-assets.mjs).
	// Static export cannot use the default Image Optimization API.
	images: {
		unoptimized: true,
		formats: ['image/webp']
	}
}

export default nextConfig
