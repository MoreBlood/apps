/** @type {import('next').NextConfig} */

const getBasePath = () => {
	if (process.env.BASE_PATH) {
		return process.env.BASE_PATH
	}

	if (process.env.GITHUB_REPOSITORY) {
		const repoName = process.env.GITHUB_REPOSITORY.split('/')[1]
		// Для username.github.io используем '/', иначе '/repo-name/'
		return repoName.endsWith('.github.io') ? '/' : `/${repoName}`
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
