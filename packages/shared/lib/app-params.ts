import { getSingleAppSlug, isSingleAppSite } from '@/config/site-mode'

/** Default app for hub shortcuts (/faq, /privacy, …). */
export const DEFAULT_APP_SLUG = 'rawclinic'

/** Resolves app slug for shortcut routes (/faq) and single-app site mode. */
export function resolveShortcutAppSlug(): string {
	return isSingleAppSite() ? getSingleAppSlug() : DEFAULT_APP_SLUG
}

export function appRouteParams(appSlug?: string) {
	return Promise.resolve({ appSlug: appSlug ?? resolveShortcutAppSlug() })
}

/** @deprecated Use `appRouteParams()` */
export function defaultAppParams() {
	return appRouteParams()
}
