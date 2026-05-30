import NextLink from 'next/link'
import AppIcon from '@/components/AppIcon'
import { DeviceScreen, IPhoneMockup } from '@/components/device'
import type { AppConfig } from '@/config'
import { getAppThemeMeta } from '@/config/app-theme'
import type { HomeAppCardData } from '@/config/home-content'
import { getAppPhoneScreenshotPath } from '@/lib/app-screenshot'

export type HomeAppCardProps = {
	slug: string
	appName: string
	tagline: string
	accentColor: string
	href: string
	eyebrow: string
	cta: string
	variant?: 'default' | 'compact'
	excerpt?: string
	mockupInstanceId?: string
	priority?: boolean
	screenshotSizes?: string
}

export function homeAppCardFromHomeData(app: HomeAppCardData): HomeAppCardProps {
	return {
		slug: app.slug,
		appName: app.appName,
		tagline: app.tagline,
		accentColor: app.accentColor,
		href: `/${app.slug}`,
		eyebrow: app.eyebrow,
		cta: 'Explore app',
		excerpt: app.excerpt,
		mockupInstanceId: `home-${app.slug}-iphone`,
		priority: app.slug === 'rawclinic',
		screenshotSizes: '(max-width: 900px) 40vw, 280px'
	}
}

export function homeAppCardFromAppConfig(app: AppConfig, overrides?: Partial<HomeAppCardProps>): HomeAppCardProps {
	const accentColor = getAppThemeMeta(app.slug)?.accentColor ?? 'blue'
	return {
		slug: app.slug,
		appName: app.appName,
		tagline: app.tagline,
		accentColor,
		href: `/${app.slug}`,
		eyebrow: 'App overview',
		cta: '← Back to overview',
		variant: 'compact',
		mockupInstanceId: `roadmap-${app.slug}-iphone`,
		screenshotSizes: '(max-width: 900px) 36vw, 240px',
		...overrides
	}
}

export default function HomeAppCard({
	slug,
	appName,
	tagline,
	accentColor,
	href,
	eyebrow,
	cta,
	variant = 'default',
	excerpt,
	mockupInstanceId,
	priority = false,
	screenshotSizes = '(max-width: 900px) 40vw, 280px'
}: HomeAppCardProps) {
	const phoneScreenshot = getAppPhoneScreenshotPath(slug)
	const compact = variant === 'compact'
	const instanceId = mockupInstanceId ?? `${compact ? 'roadmap' : 'home'}-${slug}-iphone`

	return (
		<NextLink
			href={href}
			className={compact ? 'home-app-card home-app-card--compact' : 'home-app-card'}
			data-accent={accentColor}
		>
			<div className="home-app-card__glow" aria-hidden />
			<div className="home-app-card__inner">
				<div className="home-app-card__main">
					<div className="home-app-card__icon" aria-hidden>
						<AppIcon slug={slug} />
					</div>
					<p className="home-app-card__eyebrow">{eyebrow}</p>
					<h2 className="home-app-card__title">{appName}</h2>
					<p className="home-app-card__tagline">{tagline}</p>
					{excerpt ? <p className="home-app-card__excerpt">{excerpt}</p> : null}
					<span className="home-app-card__cta">
						{cta}
						{!compact ? <span aria-hidden> →</span> : null}
					</span>
				</div>
				<div className="home-app-card__visual" aria-hidden>
					<IPhoneMockup instanceId={instanceId} wrapperClassName="home-app-card__mockup">
						<DeviceScreen
							src={phoneScreenshot}
							alt={compact ? '' : `${appName} screenshot`}
							className="home-app-card__screen"
							priority={priority}
							sizes={screenshotSizes}
						/>
					</IPhoneMockup>
				</div>
			</div>
		</NextLink>
	)
}
