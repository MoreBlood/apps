import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FAQContent } from '@/components/faq'
import { getAppBySlug } from '@/config'
import { getFAQBySlug } from '@/config/faq-content'
import type { AppRouteProps } from '@/routes/bind-shortcut-route'

export async function generateMetadata({ params }: AppRouteProps): Promise<Metadata> {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) return { title: 'App not found' }
	return {
		title: `FAQ - ${app.appName}`,
		description: `Frequently asked questions about ${app.appName}. ${app.tagline}.`
	}
}

export default async function AppFaqRoute({ params }: AppRouteProps) {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) notFound()
	if (!getFAQBySlug(appSlug)) notFound()

	return <FAQContent app={app} appSlug={appSlug} />
}
