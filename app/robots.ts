import type { MetadataRoute } from 'next'
import { getBaseUrl } from '@/lib/siteUrl'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
	const base = getBaseUrl()
	return {
		rules: { userAgent: '*', allow: '/' },
		sitemap: `${base}/sitemap.xml`
	}
}
