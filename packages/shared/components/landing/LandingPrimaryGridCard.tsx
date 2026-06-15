'use client'

import {
	type LandingSurfaceEffects,
	landingSurfaceClassName,
	landingSurfacePointerHandlers
} from '@/lib/landing-surface'
import type { LandingGridItem, LandingGridVariant } from '@/types/landing'
import LandingSurfaceLayers from './LandingSurfaceLayers'
import { getLandingGridIcon } from './landing-grid-icons'

type Props = {
	item: LandingGridItem
	variant: LandingGridVariant
	effects?: LandingSurfaceEffects
}

export default function LandingPrimaryGridCard({ item, variant, effects }: Props) {
	const ItemIcon = getLandingGridIcon(item.icon)
	const inline = variant !== 'featured'

	if (inline) {
		return (
			<li className="landing-primary-grid__card landing-primary-grid__card--inline">
				<h3 className="landing-primary-grid__title landing-primary-grid__title--inline">
					<span className="landing-primary-grid__icon landing-primary-grid__icon--inline" aria-hidden>
						<ItemIcon />
					</span>
					{item.title}
				</h3>
				<p className="landing-primary-grid__desc">{item.description}</p>
			</li>
		)
	}

	if (!effects) return null

	return (
		<li
			className={landingSurfaceClassName(effects, 'landing-primary-grid__card')}
			{...landingSurfacePointerHandlers(effects)}
		>
			<LandingSurfaceLayers effects={effects} />
			<span className="landing-primary-grid__icon" aria-hidden>
				<ItemIcon />
			</span>
			<h3 className="landing-primary-grid__title">{item.title}</h3>
			<p className="landing-primary-grid__desc">{item.description}</p>
		</li>
	)
}
