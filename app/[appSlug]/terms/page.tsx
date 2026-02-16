import { notFound } from 'next/navigation'
import { DefaultTermsContent } from '@/components/legal'
import { getAppBySlug } from '@/config'

export default async function Terms({ params }: { params: Promise<{ appSlug: string }> }) {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) notFound()

	const Content = app.TermsContent ?? DefaultTermsContent
	return <Content app={app} appSlug={appSlug} />
}
