/** Numeric App Store id from an apps.apple.com URL (for Smart App Banner meta). */
export function getAppStoreId(storeLink?: string): string | undefined {
	if (!storeLink) return undefined
	const match = /\/id(\d+)/i.exec(storeLink)
	return match?.[1]
}

/** `apple-itunes-app` meta content value for Safari Smart App Banner. */
export function getAppleItunesAppMeta(storeLink?: string, appArgument?: string): string | undefined {
	const appId = getAppStoreId(storeLink)
	if (!appId) return undefined
	const parts = [`app-id=${appId}`]
	if (appArgument) parts.push(`app-argument=${appArgument}`)
	return parts.join(', ')
}
