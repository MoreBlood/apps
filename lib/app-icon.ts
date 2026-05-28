const APP_ICON_FILES: Record<string, string> = {
	rawclinic: '/icons/raw-clinic.png',
	'aqi-sense': '/icons/aqi-sense.png'
}

export function getAppIconPath(slug: string): string {
	return APP_ICON_FILES[slug] ?? `/icons/${slug}.png`
}
