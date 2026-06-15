import { getAppBySlug, siteName } from '@/config'
import { getSingleAppSlug, isSingleAppSite } from '@/config/site-mode'
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

function singleAppNavItems(): SiteNavItem[] {
	return [
		{ href: '/', label: 'Home' },
		{ href: '/roadmap', label: 'Roadmap' },
		{ href: '/faq', label: 'FAQ' },
		{ href: '/privacy', label: 'Privacy' },
		{ href: '/terms', label: 'Terms' },
		{ href: '/feedback', label: 'Feedback' }
	]
}

export function getSiteNavItems(appSlug: string | null): SiteNavItem[] {
	if (isSingleAppSite()) {
		return singleAppNavItems()
	}

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

export type CrackNavMenuEntry =
	| { type: 'item'; href: string; label: string }
	| { type: 'separator' }
	| { type: 'sub'; label: string; items: SiteNavItem[] }

export type CrackNavMenuGroup = {
	/** Win9x menubar label */
	label: string
	/** Matches real nav aria-label */
	ariaLabel: string
	entries: CrackNavMenuEntry[]
}

const HELP_SEGMENTS = new Set(['faq', 'privacy', 'terms', 'feedback'])

function isHelpNavItem(href: string): boolean {
	const segment = href.split('/').filter(Boolean).pop()
	return segment != null && HELP_SEGMENTS.has(segment)
}

function toMenuEntries(items: SiteNavItem[]): CrackNavMenuEntry[] {
	return items.map((item) => ({ type: 'item', href: item.href, label: item.label }))
}

function buildAppMenuEntries(appItems: SiteNavItem[]): CrackNavMenuEntry[] {
	const main: SiteNavItem[] = []
	const help: SiteNavItem[] = []
	for (const item of appItems) {
		if (isHelpNavItem(item.href)) help.push(item)
		else main.push(item)
	}
	const entries = toMenuEntries(main)
	if (help.length > 0) {
		entries.push({ type: 'separator' })
		entries.push({ type: 'sub', label: 'Help', items: help })
	}
	return entries
}

/** Same links as pill nav + mobile apps list (for crack-style menubar). */
export function getCrackNavMenuGroups(
	items: SiteNavItem[],
	apps: { slug: string; appName: string }[],
	options: { appMenuLabel: string; appsSectionTitle: string }
): CrackNavMenuGroup[] {
	const { primary, app } = splitSiteNavItems(items)
	const groups: CrackNavMenuGroup[] = []

	if (primary.length > 0) {
		groups.push({ label: 'Site', ariaLabel: 'Site', entries: toMenuEntries(primary) })
	}

	if (app.length > 0) {
		groups.push({
			label: options.appMenuLabel,
			ariaLabel: options.appMenuLabel,
			entries: buildAppMenuEntries(app)
		})
	}

	if (apps.length > 0 && !isSingleAppSite()) {
		groups.push({
			label: options.appsSectionTitle,
			ariaLabel: options.appsSectionTitle,
			entries: apps.map((entry) => ({
				type: 'item',
				href: `/${entry.slug}`,
				label: entry.appName
			}))
		})
	}

	return groups
}

/** Label for the mobile nav bar title (app name on app routes; site nav label elsewhere). */
export function getSitePageTitle(pathname: string | null): string {
	if (!pathname) return siteName

	if (isSingleAppSite()) {
		const app = getAppBySlug(getSingleAppSlug())
		if (app) return app.appName
	}

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
