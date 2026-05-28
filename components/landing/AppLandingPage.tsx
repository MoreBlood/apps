'use client'

import NextLink from 'next/link'
import { Link, Strong, Text } from '@radix-ui/themes'
import type { LandingAppInfo } from '@/config'
import { getLandingBySlug } from '@/config/landing-content'
import type { AppLandingConfig, LandingFeature } from '@/types/landing'
import { getLandingGridIcon } from './landing-grid-icons'
import LandingAppIcon from './LandingAppIcon'
import LandingDeviceStage from './LandingDeviceStage'
import LandingHero from './LandingHero'
import { LandingStageTunerProvider } from './LandingStageTunerContext'
import { LandingReveal, LandingRevealItem, LandingRevealStagger } from './LandingReveal'
import LandingStoreButton from './LandingStoreButton'
import { usePreferVerticalReveal } from './usePreferVerticalReveal'

type Props = { app: LandingAppInfo }

function CtaPanel({
	app,
	title,
	subtitle,
	id
}: {
	app: LandingAppInfo
	title: string
	subtitle: string
	id: string
}) {
	return (
		<LandingReveal as="section" className="landing-cta-panel" aria-labelledby={id}>
			<div className="landing-cta-panel__card">
				<LandingAppIcon app={app} />
				<h2 className="landing-cta-panel__title" id={id}>
					{title}
				</h2>
				<p className="landing-cta-panel__sub">{subtitle}</p>
				<LandingStoreButton app={app} label="Download on the App Store" size="large" />
			</div>
		</LandingReveal>
	)
}

function FeatureSection({
	app,
	feature,
	verticalReveal
}: {
	app: LandingAppInfo
	feature: LandingFeature
	verticalReveal: boolean
}) {
	const reverse = feature.visualOnLeft === true
	const contentDirection = verticalReveal ? 'up' : reverse ? 'right' : 'left'
	const visualDirection = verticalReveal ? 'up' : reverse ? 'left' : 'right'

	return (
		<section className={`landing-feature${reverse ? ' landing-feature--reverse' : ''}`}>
			<LandingReveal className="landing-feature__content" direction={contentDirection} duration={0.7}>
				{feature.eyebrow && <p className="landing-feature__eyebrow">{feature.eyebrow}</p>}
				<h2 className="landing-feature__title">{feature.title}</h2>
				<p className="landing-feature__lead">{feature.description}</p>
				{feature.bullets && feature.bullets.length > 0 && (
					<ul className="landing-feature__bullets">
						{feature.bullets.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				)}
			</LandingReveal>
			<LandingReveal
				className="landing-feature__visual"
				direction={visualDirection}
				delay={0.08}
				duration={0.75}
			>
				<LandingDeviceStage appSlug={app.slug} appName={app.appName} variant={feature.visual} />
			</LandingReveal>
		</section>
	)
}

function HighlightsSection({ items }: { items: AppLandingConfig['highlights'] }) {
	return (
		<LandingReveal as="section" className="landing-highlights" aria-label="Key capabilities">
			<LandingRevealStagger as="ul" className="landing-highlights__grid" stagger={0.1}>
				{items.map((item) => (
					<LandingRevealItem key={item.title} className="landing-highlights__card">
						<h3 className="landing-highlights__title">{item.title}</h3>
						<p className="landing-highlights__desc">{item.description}</p>
					</LandingRevealItem>
				))}
			</LandingRevealStagger>
		</LandingReveal>
	)
}

function ShowcaseQuote({ showcase }: { showcase: AppLandingConfig['showcase'] }) {
	return (
		<LandingReveal as="section" className="landing-showcase" aria-label="Product philosophy" duration={0.8}>
			<blockquote className="landing-showcase__quote">
				<p>{showcase.quote}</p>
				<footer>{showcase.attribution}</footer>
			</blockquote>
		</LandingReveal>
	)
}

function FeatureGrid({ grid }: { grid: AppLandingConfig['grid'] }) {
	return (
		<LandingReveal as="section" className="landing-grid-section" duration={0.7}>
			<LandingReveal className="landing-grid-section__header" direction="none" delay={0.05}>
				<h2 className="landing-grid-section__title">{grid.title}</h2>
				<p className="landing-grid-section__lead">{grid.lead}</p>
			</LandingReveal>
			<LandingRevealStagger as="ul" className="landing-grid-section__grid" stagger={0.06}>
				{grid.items.map((item) => {
					const ItemIcon = getLandingGridIcon(item.icon)

					return (
						<LandingRevealItem key={item.title} className="landing-grid-section__card">
							<h3 className="landing-grid-section__card-title">
								<span className="landing-grid-section__icon" aria-hidden>
									<ItemIcon />
								</span>
								{item.title}
							</h3>
							<p>{item.description}</p>
						</LandingRevealItem>
					)
				})}
			</LandingRevealStagger>
		</LandingReveal>
	)
}

function TechBanner({ tech }: { tech: AppLandingConfig['tech'] }) {
	return (
		<LandingReveal as="section" className="landing-tech" duration={0.7}>
			<LandingReveal className="landing-tech__header" direction="none">
				<h2 className="landing-tech__title">{tech.title}</h2>
				<p className="landing-tech__lead">{tech.lead}</p>
			</LandingReveal>
			<LandingRevealStagger as="ul" className="landing-tech__list" stagger={0.12}>
				{tech.items.map((item) => (
					<LandingRevealItem key={item.title} className="landing-tech__item">
						<h3>{item.title}</h3>
						<p>{item.description}</p>
					</LandingRevealItem>
				))}
			</LandingRevealStagger>
		</LandingReveal>
	)
}

export default function AppLandingPage({ app }: Props) {
	const landing = getLandingBySlug(app.slug)
	const verticalReveal = usePreferVerticalReveal()
	if (!landing) return null

	const year = new Date().getFullYear()

	return (
		<LandingStageTunerProvider>
		<article className="landing" data-landing-app={app.slug}>
			<LandingHero app={app} landing={landing} />

			<HighlightsSection items={landing.highlights} />
			<ShowcaseQuote showcase={landing.showcase} />

			<div className="landing__features" id={`features-${app.slug}`}>
				{landing.features.map((feature) => (
					<FeatureSection
						key={feature.title}
						app={app}
						feature={feature}
						verticalReveal={verticalReveal}
					/>
				))}
			</div>

			<FeatureGrid grid={landing.grid} />
			<TechBanner tech={landing.tech} />

			<LandingReveal as="section" className="landing-closing" duration={0.75}>
				<LandingDeviceStage
					appSlug={app.slug}
					appName={app.appName}
					variant="compact"
					className="landing-closing__stage"
				/>
				<h2 className="landing-closing__title">{landing.closingTitle}</h2>
				<p className="landing-closing__lead">{landing.closingLead}</p>
			</LandingReveal>

			<CtaPanel
				app={app}
				id={`${app.slug}-get-final`}
				title={`Get ${app.appName}`}
				subtitle={landing.platformsLine}
			/>

			<LandingReveal as="footer" className="landing-footer" direction="up" duration={0.5}>
				<Text as="p" className="landing-footer__brand">
					<Strong>{app.appName}</Strong>
					<span className="landing-footer__dot" aria-hidden>
						·
					</span>
					{app.tagline}
				</Text>
				<Text as="p" className="landing-footer__contact">
					Questions?{' '}
					<Link href={`mailto:${app.contactEmail}`}>{app.contactEmail}</Link>
				</Text>
				<div className="landing-footer__row">
					<span>
						© {year} {app.appName}
					</span>
					<nav className="landing-footer__nav" aria-label="Legal">
						<Link asChild>
							<NextLink href={`/${app.slug}/privacy`}>Privacy</NextLink>
						</Link>
						<Link asChild>
							<NextLink href={`/${app.slug}/terms`}>Terms</NextLink>
						</Link>
						<Link asChild>
							<NextLink href={`/${app.slug}/feedback`}>Feedback</NextLink>
						</Link>
					</nav>
				</div>
			</LandingReveal>
		</article>
		</LandingStageTunerProvider>
	)
}
