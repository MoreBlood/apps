'use client'

import clsx from 'clsx'
import type { LandingAppInfo } from '@/config'
import { getLandingBySlug } from '@/config/landing-content'
import type { AppLandingConfig, LandingHighlight, LandingShowcase, LandingTechItem } from '@/types/landing'
import LandingAppIcon from './LandingAppIcon'
import LandingBlogSection from './LandingBlogSection'
import LandingFeaturesDeep from './LandingFeaturesDeep'
import LandingPhotoMoment from './LandingPhotoMoment'
import LandingPrimaryGrid from './LandingPrimaryGrid'
import LandingStoreButton from './LandingStoreButton'
import { getLandingGridIcon } from './landing-grid-icons'

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
		<section className={clsx('landing-cta-panel', isFinal && 'landing-cta-panel--final')} aria-labelledby={id}>
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
		</section>
	)
}

function HighlightsSection({ items }: { items: LandingHighlight[] }) {
	return (
		<section className="landing-highlights" aria-label="Key capabilities">
			<ul className="landing-highlights__grid">
				{items.map((item) => (
					<li key={item.title} className="landing-highlights__card">
						<h3 className="landing-highlights__title">{item.title}</h3>
						<p className="landing-highlights__desc">{item.description}</p>
					</li>
				))}
			</ul>
		</section>
	)
}

function ShowcaseQuote({ showcase }: { showcase: LandingShowcase }) {
	return (
		<section className="landing-showcase" aria-label="Product philosophy">
			<blockquote className="landing-showcase__quote">
				<p>{showcase.quote}</p>
				{showcase.attribution && <footer>{showcase.attribution}</footer>}
			</blockquote>
		</section>
	)
}

function FeatureGrid({ grid, compact = false }: { grid: AppLandingConfig['grid']; compact?: boolean }) {
	if (grid.items.length === 0) return null

	const headerTitle = compact ? grid.secondaryTitle : grid.title
	const headerLead = compact ? grid.secondaryLead : grid.lead
	const showHeader = Boolean(headerTitle || headerLead)

	return (
		<section className={clsx('landing-grid-section', compact && 'landing-grid-section--compact')}>
			{showHeader && (
				<header className="landing-grid-section__header">
					{headerTitle && <h2 className="landing-grid-section__title">{headerTitle}</h2>}
					{headerLead && <p className="landing-grid-section__lead">{headerLead}</p>}
				</header>
			)}
			<ul className="landing-grid-section__grid">
				{grid.items.map((item) => {
					const ItemIcon = getLandingGridIcon(item.icon)

					return (
						<li key={item.title} className="landing-grid-section__card">
							<h3 className="landing-grid-section__card-title">
								<span className="landing-grid-section__icon" aria-hidden>
									<ItemIcon />
								</span>
								{item.title}
							</h3>
							<p>{item.description}</p>
						</li>
					)
				})}
			</ul>
		</section>
	)
}

function TechBanner({ tech }: { tech: { title: string; lead: string; items: LandingTechItem[] } }) {
	return (
		<section className="landing-tech">
			<header className="landing-tech__header">
				<h2 className="landing-tech__title">{tech.title}</h2>
				<p className="landing-tech__lead">{tech.lead}</p>
			</header>
			<ul className="landing-tech__list">
				{tech.items.map((item) => (
					<li key={item.title} className="landing-tech__item">
						<h3>{item.title}</h3>
						<p>{item.description}</p>
					</li>
				))}
			</ul>
		</section>
	)
}

export default function AppLandingPage({ app }: Props) {
	const landing = getLandingBySlug(app.slug)
	if (!landing) return null

	return (
		<>
			{landing.photoMoments
				?.filter((moment) => moment.layout === 'spotlight')
				.map((moment) => (
					<LandingPhotoMoment key={moment.id} moment={moment} />
				))}

			{landing.highlights && landing.highlights.length > 0 && <HighlightsSection items={landing.highlights} />}

			{landing.showcase && <ShowcaseQuote showcase={landing.showcase} />}

			{landing.photoMoments
				?.filter((moment) => moment.layout === 'cinema')
				.map((moment) => (
					<LandingPhotoMoment key={moment.id} moment={moment} />
				))}

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
				<LandingFeaturesDeep app={app} features={landing.features} photoMoments={landing.photoMoments} />
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
		</>
	)
}
