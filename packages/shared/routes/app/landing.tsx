import type { AppRouteProps } from '@/routes/bind-shortcut-route'
import AppLandingView from '@/views/AppLandingView'

export default async function AppLandingRoute({ params }: AppRouteProps) {
	const { appSlug } = await params
	return <AppLandingView appSlug={appSlug} />
}
