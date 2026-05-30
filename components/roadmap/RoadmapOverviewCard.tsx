import NextLink from 'next/link'
import AppIcon from '@/components/AppIcon'
import { DeviceScreen, IPhoneMockup } from '@/components/device'
import type { AppConfig } from '@/config'
import { getAppThemeMeta } from '@/config/app-theme'
import { getAppPhoneScreenshotPath } from '@/lib/app-screenshot'

type Props = {
	app: AppConfig
}

export default function RoadmapOverviewCard({ app }: Props) {
	const accentColor = getAppThemeMeta(app.slug)?.accentColor ?? 'blue'
	const phoneScreenshot = getAppPhoneScreenshotPath(app.slug)

	return (
		<NextLink href={`/${app.slug}`} className="home-app-card home-app-card--compact" data-accent={accentColor}>
			<div className="home-app-card__glow" aria-hidden />
			<div className="home-app-card__inner">
				<div className="home-app-card__main">
					<div className="home-app-card__icon" aria-hidden>
						<AppIcon slug={app.slug} />
					</div>
					<p className="home-app-card__eyebrow">App overview</p>
					<h2 className="home-app-card__title">{app.appName}</h2>
					<p className="home-app-card__tagline">{app.tagline}</p>
					<span className="home-app-card__cta">← Back to overview</span>
				</div>
				<div className="home-app-card__visual" aria-hidden>
					<IPhoneMockup instanceId={`roadmap-${app.slug}-iphone`} wrapperClassName="home-app-card__mockup">
						<DeviceScreen
							src={phoneScreenshot}
							alt=""
							className="home-app-card__screen"
							sizes="(max-width: 900px) 36vw, 240px"
						/>
					</IPhoneMockup>
				</div>
			</div>
		</NextLink>
	)
}
