import AppIcon from '@/components/AppIcon'
import { DeviceScreen, IPhoneMockup } from '@/components/device'
import type { HomeAppCardData } from '@/config/home-content'
import { getAppPhoneScreenshotPath } from '@/lib/app-screenshot'
import NextLink from 'next/link'

type Props = {
	app: HomeAppCardData
}

export default function HomeAppCard({ app }: Props) {
	const phoneScreenshot = getAppPhoneScreenshotPath(app.slug)

	return (
		<NextLink href={`/${app.slug}`} className="home-app-card" data-accent={app.accentColor}>
			<div className="home-app-card__glow" aria-hidden />
			<div className="home-app-card__inner">
				<div className="home-app-card__main">
					<div className="home-app-card__icon" aria-hidden>
						<AppIcon slug={app.slug} />
					</div>
					<p className="home-app-card__eyebrow">{app.eyebrow}</p>
					<h2 className="home-app-card__title">{app.appName}</h2>
					<p className="home-app-card__tagline">{app.tagline}</p>
					<p className="home-app-card__excerpt">{app.excerpt}</p>
					<span className="home-app-card__cta">
						Explore app
						<span aria-hidden> →</span>
					</span>
				</div>
				<div className="home-app-card__visual" aria-hidden>
					<IPhoneMockup wrapperClassName="home-app-card__mockup">
						<DeviceScreen
							src={phoneScreenshot}
							alt={`${app.appName} screenshot`}
							className="home-app-card__screen"
						/>
					</IPhoneMockup>
				</div>
			</div>
		</NextLink>
	)
}
