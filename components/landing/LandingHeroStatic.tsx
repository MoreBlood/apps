import type { LandingAppInfo } from '@/config'
import type { AppLandingConfig } from '@/types/landing'
import LandingCriticalStyles from './LandingCriticalStyles'
import LandingHeroShowcase from './LandingHeroShowcase'
import LandingStoreButton from './LandingStoreButton'

type Props = {
	app: LandingAppInfo
	landing: AppLandingConfig
}

export default function LandingHeroStatic({ app, landing }: Props) {
	return (
		<section className="landing-hero" aria-labelledby={`${app.slug}-hero-title`}>
			<LandingCriticalStyles blocks={['heroShowcase']} />
			<div className="landing-hero__backdrop" aria-hidden />
			<div className="landing-hero__inner">
				<div className="landing-hero__showcase">
					<LandingHeroShowcase appSlug={app.slug} appName={app.appName} />
				</div>
				<h1
					className="landing-hero__title"
					id={`${app.slug}-hero-title`}
					data-lines={landing.heroTitle.includes('\n') ? 'multi' : undefined}
				>
					{landing.heroTitle.split('\n').map((line) => (
						<span className="landing-hero__title-line" key={line}>
							{line}
						</span>
					))}
				</h1>
				<p className="landing-hero__lead">{landing.heroLead}</p>
				<div className="landing-hero__actions">
					<LandingStoreButton app={app} label="Download on the App Store" size="large" />
					<a href={`#features-${app.slug}`} className="landing-hero__secondary-cta">
						Explore features
					</a>
				</div>
			</div>
		</section>
	)
}
