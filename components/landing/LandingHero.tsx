'use client'

import type { LandingAppInfo } from '@/config'
import type { AppLandingConfig } from '@/types/landing'
import LandingAnchorLink from './LandingAnchorLink'
import LandingDeviceStage from './LandingDeviceStage'
import { LandingHeroItem, LandingHeroReveal } from './LandingReveal'
import LandingStoreButton from './LandingStoreButton'

type Props = {
	app: LandingAppInfo
	landing: AppLandingConfig
}

export default function LandingHero({ app, landing }: Props) {
	return (
		<section className="landing-hero" aria-labelledby={`${app.slug}-hero-title`}>
			<div className="landing-hero__backdrop" aria-hidden />
			<LandingHeroReveal className="landing-hero__inner">
				<LandingHeroItem>
					<div className="landing-hero__showcase">
						<LandingDeviceStage
							appSlug={app.slug}
							appName={app.appName}
							variant="hero"
							className="landing-hero__stage"
						/>
					</div>
				</LandingHeroItem>
				<LandingHeroItem>
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
				</LandingHeroItem>
				<LandingHeroItem>
					<p className="landing-hero__lead">{landing.heroLead}</p>
				</LandingHeroItem>
				<LandingHeroItem>
					<div className="landing-hero__actions">
						<LandingStoreButton app={app} label="Download on the App Store" size="large" />
						<LandingAnchorLink href={`#features-${app.slug}`} className="landing-hero__secondary-cta">
							Explore features
						</LandingAnchorLink>
					</div>
				</LandingHeroItem>
			</LandingHeroReveal>
		</section>
	)
}
