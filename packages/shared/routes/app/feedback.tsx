import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AppFeedbackPage from '@/components/feedback/AppFeedbackPage'
import { getAppBySlug } from '@/config'
import type { AppRouteProps } from '@/routes/bind-shortcut-route'

export async function generateMetadata({ params }: AppRouteProps): Promise<Metadata> {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) return { title: 'App not found' }
	return {
		title: `Feedback - ${app.appName}`,
		description: `Send feedback for ${app.appName}. ${app.tagline}.`
	}
}

export default async function AppFeedbackRoute({ params }: AppRouteProps) {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) notFound()

	return <AppFeedbackPage app={app} appSlug={appSlug} />
}
