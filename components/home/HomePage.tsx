'use client'

import { homeContent } from '@/config/home-content'
import type { HomeAppCardData } from '@/config/home-content'
import LandingScrollProvider from '@/components/landing/LandingScrollProvider'
import { LandingHeroItem, LandingHeroReveal } from '@/components/landing/LandingReveal'
import { LandingReveal, LandingRevealItem, LandingRevealStagger } from '@/components/landing/LandingReveal'
import HomeAppCard from './HomeAppCard'

type Props = {
	apps: HomeAppCardData[]
}

export default function HomePage({ apps }: Props) {

	return (
		<LandingScrollProvider>
			<article className="landing home-page">
				<section className="landing-hero home-page__hero" aria-labelledby="home-hero-title">
					<div className="landing-hero__backdrop" aria-hidden />
					<LandingHeroReveal className="landing-hero__inner">
						<LandingHeroItem>
							<p className="landing-hero__eyebrow">{homeContent.heroEyebrow}</p>
						</LandingHeroItem>
						<LandingHeroItem>
							<h1 className="landing-hero__title" id="home-hero-title">
								{homeContent.heroTitle}
							</h1>
						</LandingHeroItem>
						<LandingHeroItem>
							<p className="landing-hero__lead">{homeContent.heroLead}</p>
						</LandingHeroItem>
					</LandingHeroReveal>
				</section>

				<section className="home-page__apps" aria-labelledby="home-apps-title">
					<h2 className="home-page__apps-title" id="home-apps-title">
						{homeContent.appsTitle}
					</h2>
					<LandingRevealStagger as="div" className="home-page__apps-grid" stagger={0.08}>
						{apps.map((app) => (
							<LandingRevealItem key={app.slug} as="div" className="home-page__apps-item">
								<HomeAppCard app={app} />
							</LandingRevealItem>
						))}
					</LandingRevealStagger>
				</section>

				<LandingReveal as="section" className="home-page__closing" aria-label="Our approach">
					<blockquote className="home-page__closing-quote">
						<p>{homeContent.closingQuote}</p>
						<footer>{homeContent.closingAttribution}</footer>
					</blockquote>
				</LandingReveal>
			</article>
		</LandingScrollProvider>
	)
}
