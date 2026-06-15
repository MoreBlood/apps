import HomePage from '@/components/home/HomePage'
import { getSingleAppSlug, isSingleAppSite } from '@/config/site-mode'
import { getHomeAppCards } from '@/lib/home-apps'
import AppLandingView from '@/views/AppLandingView'

export default function SiteHomeRoute() {
	if (isSingleAppSite()) {
		return <AppLandingView appSlug={getSingleAppSlug()} />
	}

	return <HomePage apps={getHomeAppCards()} />
}
