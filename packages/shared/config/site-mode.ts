/** `hub` = AK Apps multi-app site; `single-app` = one app at domain root (e.g. rawclinic.click). */
export type SiteMode = 'hub' | 'single-app'

export function getSiteMode(): SiteMode {
	return process.env.NEXT_PUBLIC_SITE_MODE?.trim() === 'single-app' ? 'single-app' : 'hub'
}

export function isSingleAppSite(): boolean {
	return getSiteMode() === 'single-app'
}

export const SINGLE_APP_SLUG = 'rawclinic'

export function getSingleAppSlug(): string {
	return process.env.NEXT_PUBLIC_SINGLE_APP_SLUG?.trim() || SINGLE_APP_SLUG
}
