import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AppRoadmapPage from '@/components/roadmap/AppRoadmapPage'
import { getAppBySlug } from '@/config'
import { getRoadmapBySlug } from '@/config/roadmap-content'

export async function generateMetadata({ params }: { params: Promise<{ appSlug: string }> }): Promise<Metadata> {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) return { title: 'App not found' }
	return {
		title: `Roadmap - ${app.appName}`,
		description: `Product roadmap for ${app.appName}. See what we have shipped, what is in progress, and what is planned next.`
	}
}

export default async function Roadmap({ params }: { params: Promise<{ appSlug: string }> }) {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) notFound()

	const roadmap = getRoadmapBySlug(appSlug)
	if (!roadmap) notFound()

	return <AppRoadmapPage app={app} />
}
