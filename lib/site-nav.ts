import { getAppBySlug, siteName } from '@/config'
import { getAppSlugFromPathname, normalizeSitePath, ROOT_STATIC_SEGMENTS, toComparableSitePath } from '@/lib/site-paths'

export type SiteNavItem = { href: string; label: string }

export function dedupeSiteNavItems(items: SiteNavItem[]): SiteNavItem[] {
	const seen = new Set<string>()
	return items.filter((item) => {
		if (seen.has(item.href)) return false
		seen.add(item.href)
		return true
	})
}

const PRIMARY_NAV_HREFS = new Set(['/', '/blog'])

export function getSiteNavItems(appSlug: string | null): SiteNavItem[] {
	const base: SiteNavItem[] = [
		{ href: '/', label: 'Home' },
		{ href: '/blog', label: 'Blog' }
	]
	if (!appSlug || ROOT_STATIC_SEGMENTS.has(appSlug)) return base
	return dedupeSiteNavItems([
		...base,
		{ href: `/${appSlug}`, label: 'Overview' },
		{ href: `/${appSlug}/roadmap`, label: 'Roadmap' },
		{ href: `/${appSlug}/faq`, label: 'FAQ' },
		{ href: `/${appSlug}/privacy`, label: 'Privacy' },
		{ href: `/${appSlug}/terms`, label: 'Terms' },
		{ href: `/${appSlug}/feedback`, label: 'Feedback' }
	])
}

export function splitSiteNavItems(items: SiteNavItem[]) {
	const primary: SiteNavItem[] = []
	const app: SiteNavItem[] = []
	for (const item of items) {
		if (PRIMARY_NAV_HREFS.has(item.href)) primary.push(item)
		else app.push(item)
	}
	return { primary, app }
}

/** Label for the mobile nav bar title (app name on app routes; site nav label elsewhere). */
export function getSitePageTitle(pathname: string | null): string {
	if (!pathname) return siteName

	const appSlug = getAppSlugFromPathname(pathname)
	if (appSlug) {
		const app = getAppBySlug(appSlug)
		if (app) return app.appName
	}

	const comparable = toComparableSitePath(pathname)
	const match = getSiteNavItems(null).find((item) => normalizeSitePath(item.href) === comparable)
	if (match) return match.label

	return siteName
}
