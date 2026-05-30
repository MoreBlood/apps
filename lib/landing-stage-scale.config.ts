import { MOCKUP_IPAD, MOCKUP_IPHONE } from '@/lib/device-mockup-sizes'
import type {
	ComputeStageScaleOptions,
	LandingStageLayoutKey,
	LandingStageLayoutOptions,
	StageDeviceId,
	StageDeviceSlot
} from '@/lib/landing-stage-scale.types'

export const STAGE_ARTBOARD = { w: 1200, h: 750 } as const

/** Horizontal offset from artboard center (px). */
export const STAGE_SPREAD_X = 260

export const DEFAULT_STAGE_DEVICE_Z: Record<StageDeviceId, number> = {
	ipad: 1,
	iphone: 2,
	'iphone-secondary': 1
}

const LAYOUT_IPHONE_LEFT: StageDeviceSlot[] = [
	{ id: 'iphone', x: -STAGE_SPREAD_X - 160, y: 210, rotate: 0, zIndex: 2, ...MOCKUP_IPHONE },
	{ id: 'ipad', x: STAGE_SPREAD_X, y: 0, rotate: 0, zIndex: 1, ...MOCKUP_IPAD }
]

const LAYOUT_IPAD_LEFT: StageDeviceSlot[] = [
	{ id: 'ipad', x: -STAGE_SPREAD_X, y: 0, rotate: 0, zIndex: 1, ...MOCKUP_IPAD },
	{ id: 'iphone', x: STAGE_SPREAD_X + 160, y: 210, rotate: 0, zIndex: 2, ...MOCKUP_IPHONE }
]

export const LANDING_STAGE_LAYOUTS: Record<LandingStageLayoutKey, StageDeviceSlot[]> = {
	default: LAYOUT_IPHONE_LEFT,
	'iphone-left': LAYOUT_IPAD_LEFT,
	'ipad-left': LAYOUT_IPHONE_LEFT
}

/** Hero + closing stage — extra headroom in tall showcase. */
export const LANDING_STAGE_HERO_SCALE_OPTIONS: Omit<ComputeStageScaleOptions, 'debugLabel' | 'layoutKey'> = {
	padding: 0,
	fitMargin: 1,
	maxScale: 2,
	clusterScaleMult: 1.2
}

/** Deep feature rows — fit inside stage box (no top/bottom clip). */
export const LANDING_STAGE_FEATURE_SCALE_OPTIONS: Omit<ComputeStageScaleOptions, 'debugLabel' | 'layoutKey'> = {
	padding: 10,
	fitMargin: 1,
	maxScale: 2,
	shadowPad: 16,
	clusterScaleMult: 1
}

/** @deprecated Use hero or feature options. */
export const LANDING_STAGE_SCALE_OPTIONS = LANDING_STAGE_HERO_SCALE_OPTIONS

/** Alternating device order for deep feature stages. */
export function getFeatureStageLayoutKey(featureIndex: number): LandingStageLayoutKey {
	return featureIndex % 2 === 0 ? 'iphone-left' : 'ipad-left'
}

export function getLandingStageLayoutKey(
	_variant?: string,
	options?: LandingStageLayoutOptions
): LandingStageLayoutKey {
	if (options?.featureIndex != null) {
		return getFeatureStageLayoutKey(options.featureIndex)
	}
	return 'default'
}

export function getLandingStageDevices(layoutKey: LandingStageLayoutKey): StageDeviceSlot[] {
	return LANDING_STAGE_LAYOUTS[layoutKey]
}

export function cloneLandingStageSlots(slots: StageDeviceSlot[]): StageDeviceSlot[] {
	return slots.map((slot) => ({ ...slot }))
}
