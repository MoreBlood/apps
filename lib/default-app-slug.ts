/** Default app for site-wide shortcuts (/faq, /privacy, …). */
export const DEFAULT_APP_SLUG = 'rawclinic'

export function defaultAppParams() {
	return Promise.resolve({ appSlug: DEFAULT_APP_SLUG })
}
