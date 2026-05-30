'use client'

import {
	type LandingSurfaceEffects,
	landingSurfaceClassName,
	landingSurfacePointerHandlers
} from '@/lib/landing-surface'
import type { LandingGridItem } from '@/types/landing'
import LandingSurfaceLayers from './LandingSurfaceLayers'
import { getLandingGridIcon } from './landing-grid-icons'

type Props = {
	item: LandingGridItem
	effects: LandingSurfaceEffects
}

export default function LandingPrimaryGridCard({ item, effects }: Props) {
	const ItemIcon = getLandingGridIcon(item.icon)

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
