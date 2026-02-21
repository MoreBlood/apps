import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DefaultPrivacyContent } from '@/components/legal'
import { getAppBySlug } from '@/config'

export async function generateMetadata({
	params
}: {
	params: Promise<{ appSlug: string }>
}): Promise<Metadata> {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) return { title: 'App not found' }
	return {
		title: `Privacy Policy - ${app.appName}`,
		description: `Privacy policy for ${app.appName}. ${app.tagline}.`
	}
}

export default async function Privacy({ params }: { params: Promise<{ appSlug: string }> }) {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) notFound()

	const Content = app.PrivacyContent ?? DefaultPrivacyContent
	return <Content app={app} />
}
