import type { MetadataRoute } from 'next'
import { getApps } from '@/config'
import { getBaseUrl } from '@/lib/siteUrl'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
	const base = getBaseUrl()
	const entries: MetadataRoute.Sitemap = [
		{
			url: `${base}/`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 1
		}
	]
	for (const app of getApps()) {
		entries.push(
			{
				url: `${base}/${app.slug}/`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.9
			},
			{
				url: `${base}/${app.slug}/privacy/`,
				lastModified: new Date(),
				changeFrequency: 'yearly',
				priority: 0.5
			},
			{
				url: `${base}/${app.slug}/terms/`,
				lastModified: new Date(),
				changeFrequency: 'yearly',
				priority: 0.5
			},
			{
				url: `${base}/${app.slug}/feedback/`,
				lastModified: new Date(),
				changeFrequency: 'monthly',
				priority: 0.5
			}
		)
	}
	return entries
}
