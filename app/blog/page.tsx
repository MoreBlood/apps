import type { Metadata } from 'next'
import BlogPage from '@/components/blog/BlogPage'
import { siteName } from '@/config'

export const metadata: Metadata = {
	title: `Blog · ${siteName}`,
	description: 'Product notes and photography workflows from Artihovich Apps.'
}

export default function Page() {
	return <BlogPage />
}
