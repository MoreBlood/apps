'use client'

import clsx from 'clsx'
import { LANDING_SURFACE_GRID } from '@/lib/landing-surface'
import { stableDomId } from '@/lib/stable-dom-id'
import type { LandingGridItem, LandingGridVariant } from '@/types/landing'
import LandingPrimaryGridCard from './LandingPrimaryGridCard'

type Props = {
	id?: string
	title?: string
	lead?: string
	items: LandingGridItem[]
	/** featured = metal surface cards; panel / compact = inline cards in a bordered section */
	variant?: LandingGridVariant
}

const gridSurface = LANDING_SURFACE_GRID

export default function LandingPrimaryGrid({ id, title, lead, items, variant = 'featured' }: Props) {
	const titleId = id ? stableDomId(id, 'title') : undefined

	if (items.length === 0) return null

	const sectionClass = clsx(
		'landing-primary-grid',
		variant === 'panel' && 'landing-primary-grid--panel',
		variant === 'compact' && 'landing-primary-grid--panel landing-primary-grid--compact'
	)

	return (
		<section id={id} className={sectionClass} aria-labelledby={title && titleId ? titleId : undefined}>
			{(title || lead) && (
				<header className="landing-primary-grid__header">
					{title && (
						<h2 className="landing-primary-grid__section-title" id={titleId}>
							{title}
						</h2>
					)}
					{lead && <p className="landing-primary-grid__section-lead">{lead}</p>}
				</header>
			)}
			<ul className="landing-primary-grid__grid">
				{items.map((item) => (
					<LandingPrimaryGridCard
						key={item.title}
						item={item}
						variant={variant}
						effects={variant === 'featured' ? gridSurface : undefined}
					/>
				))}
			</ul>
		</section>
	)
}
