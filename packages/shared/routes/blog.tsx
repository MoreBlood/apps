import type { Metadata } from 'next'
import BlogPage from '@/components/blog/BlogPage'
import { getAppBySlug, siteName } from '@/config'
import { getSingleAppSlug, isSingleAppSite } from '@/config/site-mode'

export function generateBlogMetadata(): Metadata {
	if (isSingleAppSite()) {
		const app = getAppBySlug(getSingleAppSlug())
		const appName = app?.appName ?? 'RAW Clinic'
		return {
			title: `Blog · ${appName}`,
			description: `Product notes and ProRAW photography workflows from ${appName}.`
		}
	}

	return {
		title: `Blog · ${siteName}`,
		description: 'Product notes and photography workflows from AK Apps.'
	}
}

export const metadata = generateBlogMetadata()

export default function BlogRoute() {
	return <BlogPage />
}
