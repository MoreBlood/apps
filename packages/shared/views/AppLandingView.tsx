import { notFound } from 'next/navigation'
import { preload } from 'react-dom'
import AppLandingPage from '@/components/landing/AppLandingPage'
import LandingAbExperiment from '@/components/landing/LandingAbExperiment'
import LandingHeroStatic from '@/components/landing/LandingHeroStatic'
import LandingScrollProvider from '@/components/landing/LandingScrollProvider'
import { LandingStageTunerProvider } from '@/components/landing/LandingStageTunerContext'
import { getAppBySlug, toLandingAppInfo } from '@/config'
import { getLandingBySlug } from '@/config/landing-content'
import { getLandingLcpPreloads } from '@/lib/landing-performance'

type Props = {
	appSlug: string
}

export default async function AppLandingView({ appSlug }: Props) {
	const app = getAppBySlug(appSlug)
	if (!app) notFound()

	const landing = getLandingBySlug(appSlug)
	if (!landing) notFound()

	for (const asset of getLandingLcpPreloads(landing)) {
		preload(asset.href, { as: asset.as, fetchPriority: asset.fetchPriority })
	}

	const landingApp = toLandingAppInfo(app)

	return (
		<LandingScrollProvider>
			<LandingStageTunerProvider>
				<article className={`landing landing--${appSlug}`} data-landing-app={appSlug}>
					<LandingAbExperiment app={landingApp}>
						<LandingHeroStatic app={landingApp} landing={landing} />
						<AppLandingPage app={landingApp} />
					</LandingAbExperiment>
				</article>
			</LandingStageTunerProvider>
		</LandingScrollProvider>
	)
}
