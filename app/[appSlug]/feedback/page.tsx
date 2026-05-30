import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AppFeedbackPage from '@/components/feedback/AppFeedbackPage'
import { getAppBySlug } from '@/config'

export async function generateMetadata({ params }: { params: Promise<{ appSlug: string }> }): Promise<Metadata> {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) return { title: 'App not found' }
	return {
		title: `Feedback - ${app.appName}`,
		description: `Send feedback for ${app.appName}. ${app.tagline}.`
	}
}

export default async function Feedback({ params }: { params: Promise<{ appSlug: string }> }) {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) notFound()

	return <AppFeedbackPage app={app} appSlug={appSlug} />
}
