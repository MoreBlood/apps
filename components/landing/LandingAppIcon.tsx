import type { LandingAppInfo } from '@/config'

export default function LandingAppIcon({ app }: { app: LandingAppInfo }) {
	const initial = app.appName.replace(/\s+/g, '').slice(0, 2).toUpperCase()
	return (
		<div className="landing-icon" aria-hidden>
			<div className="landing-icon__shine" />
			<span className="landing-icon__letter">{initial}</span>
		</div>
	)
}
