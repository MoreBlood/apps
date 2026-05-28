import { getApps } from '@/config'
import type { HomeAppCardData } from '@/config/home-content'
import { getLandingBySlug } from '@/config/landing-content'

function descriptionExcerpt(text: string): string {
	const first = text
		.split(/\n\n+/)
		.map((s) => s.trim())
		.find(Boolean)
	return first ?? text
}

export function getHomeAppCards(): HomeAppCardData[] {
	return getApps().map((app) => {
		const landing = getLandingBySlug(app.slug)
		return {
			slug: app.slug,
			appName: app.appName,
			tagline: app.tagline,
			excerpt: descriptionExcerpt(app.description),
			eyebrow: landing?.heroEyebrow ?? 'iOS app',
			accentColor: app.accentColor,
			storeLink: app.storeLink
		}
	})
}
