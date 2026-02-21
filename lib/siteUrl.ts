export function getBaseUrl(): string {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
	const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
	if (siteUrl) {
		const base = siteUrl.replace(/\/$/, '')
		return basePath ? `${base}${basePath.startsWith('/') ? basePath : `/${basePath}`}` : base
	}
	return 'https://example.com'
}
