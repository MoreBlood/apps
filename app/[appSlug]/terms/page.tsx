import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DefaultTermsContent } from '@/components/legal'
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
		title: `Terms of Service - ${app.appName}`,
		description: `Terms of service for ${app.appName}. ${app.tagline}.`
	}
}

export default async function Terms({ params }: { params: Promise<{ appSlug: string }> }) {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) notFound()

	const Content = app.TermsContent ?? DefaultTermsContent
	return <Content app={app} appSlug={appSlug} />
}
