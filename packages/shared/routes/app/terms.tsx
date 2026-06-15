import { Container } from '@radix-ui/themes'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AppContactCta from '@/components/AppContactCta'
import { DefaultTermsContent } from '@/components/legal'
import { getAppBySlug } from '@/config'
import type { AppRouteProps } from '@/routes/bind-shortcut-route'

export async function generateMetadata({ params }: AppRouteProps): Promise<Metadata> {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) return { title: 'App not found' }
	return {
		title: `Terms of Service - ${app.appName}`,
		description: `Terms of service for ${app.appName}. ${app.tagline}.`
	}
}

export default async function AppTermsRoute({ params }: AppRouteProps) {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) notFound()

	const Content = app.TermsContent ?? DefaultTermsContent
	return (
		<>
			<Content app={app} appSlug={appSlug} />
			<Container size="2">
				<AppContactCta appSlug={appSlug} contactEmail={app.contactEmail} />
			</Container>
		</>
	)
}
