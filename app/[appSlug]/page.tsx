import { notFound } from 'next/navigation'
import AppLandingPage from '@/components/landing/AppLandingPage'
import LandingScrollProvider from '@/components/landing/LandingScrollProvider'
import { getLandingBySlug } from '@/config/landing-content'
import { getAppBySlug, toLandingAppInfo } from '@/config'

export default async function AppLanding({ params }: { params: Promise<{ appSlug: string }> }) {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) notFound()

	const landing = getLandingBySlug(appSlug)
	if (!landing) notFound()

	return (
		<LandingScrollProvider>
			<AppLandingPage app={toLandingAppInfo(app)} />
		</LandingScrollProvider>
	)
}
