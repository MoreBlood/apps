import clsx from 'clsx'
import type { MouseEvent, TouchEvent } from 'react'
import {
	onLandingSurfacePointerLeave,
	onLandingSurfacePointerMove,
	onLandingSurfaceTouchEnd,
	onLandingSurfaceTouchMove
} from './landing-surface-pointer'

export type LandingSurfaceRadius = 'card' | 'tile' | 'section'

export type LandingSurfaceEffects = {
	metal?: boolean
	dots?: boolean
	grain?: boolean
	pointer?: boolean
	specular?: boolean
	rim?: boolean
	/** Continuous Apple-style squircle corners (default on) */
	appleCorners?: boolean
	/** Corner size preset — maps to --landing-surface-radius */
	radius?: LandingSurfaceRadius
}

const RADIUS_CLASS: Record<LandingSurfaceRadius, string> = {
	card: 'landing-surface--radius-card',
	tile: 'landing-surface--radius-tile',
	section: 'landing-surface--radius-section'
}

/** Primary grid cards — full machined metal treatment */
export const LANDING_SURFACE_GRID: LandingSurfaceEffects = {
	metal: true,
	dots: true,
	grain: true,
	pointer: true,
	specular: true,
	rim: true,
	appleCorners: true,
	radius: 'card'
}

/** Metal gradient + dot array only */
export const LANDING_SURFACE_METAL_DOTS: LandingSurfaceEffects = {
	metal: true,
	dots: true,
	appleCorners: true,
	radius: 'card'
}

export function landingSurfaceClassName(effects: LandingSurfaceEffects, className?: string): string {
	const appleCorners = effects.appleCorners !== false
	const radius = effects.radius ?? 'card'

	return clsx(
		'landing-surface',
		appleCorners && 'landing-surface--apple-corners',
		RADIUS_CLASS[radius],
		effects.metal && 'landing-surface--metal',
		effects.dots && 'landing-surface--dots',
		effects.grain && 'landing-surface--grain',
		effects.pointer && 'landing-surface--pointer',
		effects.specular && 'landing-surface--specular',
		effects.rim && 'landing-surface--rim',
		className
	)
}

export function landingSurfacePointerHandlers(effects: LandingSurfaceEffects): {
	onMouseEnter?: (event: MouseEvent<HTMLElement>) => void
	onMouseMove?: (event: MouseEvent<HTMLElement>) => void
	onMouseLeave?: (event: MouseEvent<HTMLElement>) => void
	onTouchStart?: (event: TouchEvent<HTMLElement>) => void
	onTouchMove?: (event: TouchEvent<HTMLElement>) => void
	onTouchEnd?: (event: TouchEvent<HTMLElement>) => void
} {
	if (!effects.pointer) {
		return {}
	}

	return {
		onMouseEnter: onLandingSurfacePointerMove,
		onMouseMove: onLandingSurfacePointerMove,
		onMouseLeave: onLandingSurfacePointerLeave,
		onTouchStart: onLandingSurfaceTouchMove,
		onTouchMove: onLandingSurfaceTouchMove,
		onTouchEnd: onLandingSurfaceTouchEnd
	}
}

export function landingSurfaceHasTexture(effects: LandingSurfaceEffects): boolean {
	return Boolean(effects.dots || effects.grain)
}
