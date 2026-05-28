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
					<p className="landing-hero__eyebrow">{landing.heroEyebrow}</p>
				</LandingHeroItem>
				<LandingHeroItem>
					<h1 className="landing-hero__title" id={`${app.slug}-hero-title`}>
						{landing.heroTitle}
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
				<LandingHeroItem>
					<ul className="landing-hero__pillars">
						{landing.pillars.map((pillar) => (
							<li key={pillar.label} className="landing-hero__pillar">
								<span className="landing-hero__pillar-value">{pillar.value}</span>
								<span className="landing-hero__pillar-label">{pillar.label}</span>
							</li>
						))}
					</ul>
				</LandingHeroItem>
				<LandingHeroItem>
					<LandingDeviceStage
						appSlug={app.slug}
						appName={app.appName}
						variant="hero"
						className="landing-hero__stage"
					/>
				</LandingHeroItem>
			</LandingHeroReveal>
		</section>
	)
}
