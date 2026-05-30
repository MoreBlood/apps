'use client'

import { LANDING_SURFACE_GRID, landingSurfaceClassName, landingSurfacePointerHandlers } from '@/lib/landing-surface'
import { stableDomId } from '@/lib/stable-dom-id'
import type { LandingGridItem } from '@/types/landing'
import { LandingReveal, LandingRevealItem, LandingRevealStagger } from './LandingReveal'
import LandingSurfaceLayers from './LandingSurfaceLayers'
import { getLandingGridIcon } from './landing-grid-icons'

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
		<LandingReveal
			as="section"
			id={id}
			className="landing-primary-grid"
			aria-labelledby={title && titleId ? titleId : undefined}
			duration={0.75}
		>
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
			<LandingRevealStagger as="ul" className="landing-primary-grid__grid" stagger={0.08}>
				{items.map((item) => {
					const ItemIcon = getLandingGridIcon(item.icon)

					return (
						<LandingRevealItem
							key={item.title}
							className={landingSurfaceClassName(gridSurface, 'landing-primary-grid__card')}
							{...landingSurfacePointerHandlers(gridSurface)}
						>
							<LandingSurfaceLayers effects={gridSurface} />
							<span className="landing-primary-grid__icon" aria-hidden>
								<ItemIcon />
							</span>
							<h3 className="landing-primary-grid__title">{item.title}</h3>
							<p className="landing-primary-grid__desc">{item.description}</p>
						</LandingRevealItem>
					)
				})}
			</LandingRevealStagger>
		</LandingReveal>
	)
}
