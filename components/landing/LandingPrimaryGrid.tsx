'use client'

import { LANDING_SURFACE_GRID } from '@/lib/landing-surface'
import { stableDomId } from '@/lib/stable-dom-id'
import type { LandingGridItem } from '@/types/landing'
import LandingPrimaryGridCard from './LandingPrimaryGridCard'

type Props = {
	id?: string
	title?: string
	lead?: string
	items: LandingGridItem[]
}

const gridSurface = LANDING_SURFACE_GRID

export default function LandingPrimaryGrid({ id, title, lead, items }: Props) {
	const titleId = id ? stableDomId(id, 'title') : undefined

	if (items.length === 0) return null

	return (
		<section id={id} className="landing-primary-grid" aria-labelledby={title && titleId ? titleId : undefined}>
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
					<LandingPrimaryGridCard key={item.title} item={item} effects={gridSurface} />
				))}
			</ul>
		</section>
	)
}
