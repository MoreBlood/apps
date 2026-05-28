import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FAQContent } from '@/components/faq'
import { getAppBySlug } from '@/config'
import { getFAQBySlug } from '@/config/faq-content'

export async function generateMetadata({
	params
}: {
	params: Promise<{ appSlug: string }>
}): Promise<Metadata> {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) return { title: 'App not found' }
	return {
		title: `FAQ - ${app.appName}`,
		description: `Frequently asked questions about ${app.appName}. ${app.tagline}.`
	}
}

export default async function FAQ({ params }: { params: Promise<{ appSlug: string }> }) {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) notFound()
	if (!getFAQBySlug(appSlug)) notFound()

	return <FAQContent app={app} appSlug={appSlug} />
}
