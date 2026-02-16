import { notFound } from 'next/navigation'
import { DefaultPrivacyContent } from '@/components/legal'
import { getAppBySlug } from '@/config'

export default async function Privacy({ params }: { params: Promise<{ appSlug: string }> }) {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) notFound()

	const Content = app.PrivacyContent ?? DefaultPrivacyContent
	return <Content app={app} />
}
