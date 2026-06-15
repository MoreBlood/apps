import type { MetadataRoute } from 'next'
import { getApps } from '@/config'
import { isSingleAppSite } from '@/config/site-mode'
import { getBaseUrl } from '@/lib/siteUrl'

const APP_SUB_ROUTES = ['roadmap', 'faq', 'privacy', 'terms', 'feedback'] as const

function singleAppSitemap(base: string): MetadataRoute.Sitemap {
	const lastModified = new Date()
	return [
		{ url: `${base}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
		...APP_SUB_ROUTES.map((segment) => ({
			url: `${base}/${segment}/`,
			lastModified,
			changeFrequency: (segment === 'privacy' || segment === 'terms'
				? 'yearly'
				: 'monthly') as MetadataRoute.Sitemap[number]['changeFrequency'],
			priority: segment === 'roadmap' || segment === 'faq' ? 0.6 : 0.5
		}))
	]
}

function hubSitemap(base: string): MetadataRoute.Sitemap {
	const lastModified = new Date()
	const entries: MetadataRoute.Sitemap = [
		{ url: `${base}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
		{ url: `${base}/blog/`, lastModified, changeFrequency: 'monthly', priority: 0.7 }
	]

	for (const app of getApps()) {
		entries.push({
			url: `${base}/${app.slug}/`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.9
		})
		for (const segment of APP_SUB_ROUTES) {
			entries.push({
				url: `${base}/${app.slug}/${segment}/`,
				lastModified,
				changeFrequency: segment === 'privacy' || segment === 'terms' ? 'yearly' : 'monthly',
				priority: segment === 'roadmap' || segment === 'faq' ? 0.6 : 0.5
			})
		}
	}

	return entries
}

export default function sitemap(): MetadataRoute.Sitemap {
	const base = getBaseUrl()
	return isSingleAppSite() ? singleAppSitemap(base) : hubSitemap(base)
}
