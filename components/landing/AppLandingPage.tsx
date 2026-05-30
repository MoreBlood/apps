'use client'

import { Fragment } from 'react'
import clsx from 'clsx'
import type { LandingAppInfo } from '@/config'
import { getLandingBySlug } from '@/config/landing-content'
import type {
	AppLandingConfig,
	LandingFeature,
	LandingHighlight,
	LandingShowcase,
	LandingTechItem
} from '@/types/landing'
import { getLandingGridIcon } from './landing-grid-icons'
import LandingAppIcon from './LandingAppIcon'
import LandingDeviceStage from './LandingDeviceStage'
import LandingHero from './LandingHero'
import LandingBlogSection from './LandingBlogSection'
import LandingPhotoMoment from './LandingPhotoMoment'
import LandingPrimaryGrid from './LandingPrimaryGrid'
import { LandingStageTunerProvider } from './LandingStageTunerContext'
import { LandingReveal, LandingRevealItem, LandingRevealStagger } from './LandingReveal'
import LandingStoreButton from './LandingStoreButton'
import { usePreferVerticalReveal } from './usePreferVerticalReveal'

type Props = { app: LandingAppInfo }

function CtaPanel({
	app,
	title,
	subtitle,
	platformsLine,
	id,
	variant = 'default'
}: {
	app: LandingAppInfo
	title: string
	subtitle: string
	platformsLine?: string
	id: string
	variant?: 'default' | 'final'
}) {
	const isFinal = variant === 'final'

	return (
		<LandingReveal
			as="section"
			className={clsx('landing-cta-panel', isFinal && 'landing-cta-panel--final')}
			aria-labelledby={id}
			duration={isFinal ? 0.8 : 0.7}
		>
			{isFinal ? (
				<>
					<LandingAppIcon app={app} />
					<h2 className="landing-cta-panel__title" id={id}>
						{title}
					</h2>
					<p className="landing-cta-panel__sub">{subtitle}</p>
					{platformsLine && <p className="landing-cta-panel__platforms">{platformsLine}</p>}
					<LandingStoreButton app={app} label="Download on the App Store" size="large" />
				</>
			) : (
				<div className="landing-cta-panel__card">
					<LandingAppIcon app={app} />
					<h2 className="landing-cta-panel__title" id={id}>
						{title}
					</h2>
					<p className="landing-cta-panel__sub">{subtitle}</p>
					{platformsLine && <p className="landing-cta-panel__platforms">{platformsLine}</p>}
					<LandingStoreButton app={app} label="Download on the App Store" size="large" />
				</div>
			)}
		</LandingReveal>
	)
}

function FeatureSection({
	app,
	feature,
	featureIndex,
	verticalReveal
}: {
	app: LandingAppInfo
	feature: LandingFeature
	featureIndex: number
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
				<LandingDeviceStage
					appSlug={app.slug}
					appName={app.appName}
					variant={feature.visual}
					featureIndex={featureIndex}
				/>
			</LandingReveal>
		</section>
	)
}

function HighlightsSection({ items }: { items: LandingHighlight[] }) {
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

function ShowcaseQuote({ showcase }: { showcase: LandingShowcase }) {
	return (
		<LandingReveal as="section" className="landing-showcase" aria-label="Product philosophy" duration={0.8}>
			<blockquote className="landing-showcase__quote">
				<p>{showcase.quote}</p>
				{showcase.attribution && <footer>{showcase.attribution}</footer>}
			</blockquote>
		</LandingReveal>
	)
}

function FeatureGrid({
	grid,
	compact = false
}: {
	grid: AppLandingConfig['grid']
	compact?: boolean
}) {
	if (grid.items.length === 0) return null

	const headerTitle = compact ? grid.secondaryTitle : grid.title
	const headerLead = compact ? grid.secondaryLead : grid.lead
	const showHeader = Boolean(headerTitle || headerLead)

	return (
		<LandingReveal
			as="section"
			className={clsx('landing-grid-section', compact && 'landing-grid-section--compact')}
			duration={0.7}
		>
			{showHeader && (
				<LandingReveal className="landing-grid-section__header" direction="none" delay={0.05}>
					{headerTitle && <h2 className="landing-grid-section__title">{headerTitle}</h2>}
					{headerLead && <p className="landing-grid-section__lead">{headerLead}</p>}
				</LandingReveal>
			)}
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

function TechBanner({
	tech
}: {
	tech: { title: string; lead: string; items: LandingTechItem[] }
}) {
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

	return (
		<LandingStageTunerProvider>
		<article
			className={`landing landing--${app.slug}`}
			data-landing-app={app.slug}
		>
			<LandingHero app={app} landing={landing} />

			{landing.photoMoments
				?.filter((moment) => moment.layout === 'spotlight')
				.map((moment) => <LandingPhotoMoment key={moment.id} moment={moment} />)}

			{landing.highlights && landing.highlights.length > 0 && (
				<HighlightsSection items={landing.highlights} />
			)}

			{landing.showcase && <ShowcaseQuote showcase={landing.showcase} />}

			{landing.photoMoments
				?.filter((moment) => moment.layout === 'cinema')
				.map((moment) => <LandingPhotoMoment key={moment.id} moment={moment} />)}

			{landing.grid.primary && landing.grid.primary.length > 0 && (
				<LandingPrimaryGrid
					id={`features-${app.slug}`}
					title={landing.grid.title}
					lead={landing.grid.lead}
					items={landing.grid.primary}
				/>
			)}

			<FeatureGrid grid={landing.grid} compact={Boolean(landing.grid.primary?.length)} />

			{landing.features.length > 0 && (
				<div className="landing__features landing__features--deep">
					{landing.features.map((feature, index) => (
						<Fragment key={feature.title}>
							<FeatureSection
								app={app}
								feature={feature}
								featureIndex={index}
								verticalReveal={verticalReveal}
							/>
							{landing.photoMoments
								?.filter((moment) => moment.afterFeature === index)
								.map((moment) => (
									<LandingPhotoMoment key={moment.id} moment={moment} />
								))}
						</Fragment>
					))}
				</div>
			)}

			{landing.tech && <TechBanner tech={landing.tech} />}

			<CtaPanel
				app={app}
				id={`${app.slug}-get-final`}
				variant="final"
				title={landing.closingTitle}
				subtitle={landing.closingLead}
				platformsLine={landing.platformsLine}
			/>

			{landing.blog != null && <LandingBlogSection appSlug={app.slug} section={landing.blog} />}
		</article>
		</LandingStageTunerProvider>
	)
}
