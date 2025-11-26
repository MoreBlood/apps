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
	output: 'export',
	...(basePath && { basePath }),
	...(basePath && { assetPrefix: basePath }),
	trailingSlash: true,
	images: {
		unoptimized: true
	}
}

export default nextConfig

