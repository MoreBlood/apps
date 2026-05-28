import { getApps } from '@/config'

/** Top-level routes that are not `/{appSlug}` landing paths. */
export const ROOT_STATIC_SEGMENTS = new Set([
	'blog',
	'faq',
	'feedback',
	'privacy',
	'terms',
	'roadmap'
])

const KNOWN_APP_SLUGS = new Set(getApps().map((app) => app.slug))

export function normalizeSitePath(pathname: string): string {
	const trimmed = pathname.replace(/\/$/, '')
	return trimmed || '/'
}

function stripBasePath(pathname: string): string {
	const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
	if (!basePath) return pathname
	const prefix = basePath.startsWith('/') ? basePath : `/${basePath}`
	if (pathname === prefix) return '/'
	if (pathname.startsWith(`${prefix}/`)) {
		return pathname.slice(prefix.length) || '/'
	}
	return pathname
}

/** First path segment when it is a registered app slug, otherwise null. */
export function getAppSlugFromPathname(pathname: string | null): string | null {
	if (!pathname) return null
	const normalized = normalizeSitePath(stripBasePath(pathname))
	if (normalized === '/') return null
	const segment = normalized.split('/').filter(Boolean)[0]
	if (!segment || ROOT_STATIC_SEGMENTS.has(segment) || !KNOWN_APP_SLUGS.has(segment)) {
		return null
	}
	return segment
}

export function isAppLandingPath(pathname: string | null): boolean {
	if (!pathname) return false
	const match = pathname.match(/^\/([^/]+)\/?$/)
	if (!match) return false
	return !ROOT_STATIC_SEGMENTS.has(match[1])
}
