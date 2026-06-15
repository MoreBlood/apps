/** Site origin (scheme + host), without deploy basePath. */
export function resolveSiteOrigin(): string {
	const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
	if (explicit) {
		return explicit.replace(/\/$/, '')
	}

	const gh = process.env.GITHUB_REPOSITORY
	if (gh) {
		const [owner, repo] = gh.split('/')
		if (repo.endsWith('.github.io')) {
			return `https://${repo}`
		}
		return `https://${owner}.github.io`
	}

	if (process.env.NODE_ENV !== 'production') {
		return 'http://localhost:3000'
	}

	return 'https://example.com'
}

/** Public site root including optional NEXT_PUBLIC_BASE_PATH (for sitemap, JSON-LD, canonical). */
export function getBaseUrl(): string {
	const origin = resolveSiteOrigin()
	const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/^\/|\/$/g, '')
	return basePath ? `${origin}/${basePath}` : origin
}

/** Base for Next.js metadata (relative og/canonical paths resolve here). */
export function getMetadataBase(): URL {
	return new URL(`${getBaseUrl()}/`)
}
