import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AppRoadmapPage from '@/components/roadmap/AppRoadmapPage'
import { getAppBySlug } from '@/config'
import { getRoadmapBySlug } from '@/config/roadmap-content'
import type { AppRouteProps } from '@/routes/bind-shortcut-route'

export async function generateMetadata({ params }: AppRouteProps): Promise<Metadata> {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) return { title: 'App not found' }
	return {
		title: `Roadmap - ${app.appName}`,
		description: `Product roadmap for ${app.appName}. See what we have shipped, what is in progress, and what is planned next.`
	}
}

export default async function AppRoadmapRoute({ params }: AppRouteProps) {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) notFound()

	const roadmap = getRoadmapBySlug(appSlug)
	if (!roadmap) notFound()

	return <AppRoadmapPage app={app} />
}
