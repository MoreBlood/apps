import type { RadixAccentColor } from '@/config'
import { getAppSlugFromPathname } from '@/lib/site-paths'

/** Radix accent for hub routes (`/`, `/blog`, `/faq`, …) — neutral chrome. */
export const HUB_ACCENT_COLOR = 'gray' as const satisfies RadixAccentColor

export type AppAccentColor = 'red' | 'green'

/** Serializable theme metadata for client components (no React component refs). */
export type AppThemeMeta = {
	slug: string
	accentColor: AppAccentColor
}

const appThemes: AppThemeMeta[] = [
	{ slug: 'rawclinic', accentColor: 'red' },
	{ slug: 'aqi-sense', accentColor: 'green' }
]

export function getAppThemeMeta(slug: string): AppThemeMeta | null {
	return appThemes.find((app) => app.slug === slug) ?? null
}

/** Product accent on `/{appSlug}` routes; hub accent elsewhere. */
export function resolveThemeAccent(pathname: string | null): RadixAccentColor {
	const slug = getAppSlugFromPathname(pathname)
	if (!slug) return HUB_ACCENT_COLOR
	return getAppThemeMeta(slug)?.accentColor ?? HUB_ACCENT_COLOR
}
