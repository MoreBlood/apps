import AppIcon from '@/components/AppIcon'
import type { LandingAppInfo } from '@/config'

export default function LandingAppIcon({ app }: { app: LandingAppInfo }) {
	return (
		<div className="landing-icon" aria-hidden>
			<AppIcon slug={app.slug} />
		</div>
	)
}
