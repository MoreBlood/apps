import { describe, expect, it } from 'vitest'
import {
	clusterPixelSnapScore,
	computeLandingStageScale,
	computeLandingStageScaleResult,
	deviceRectArtboard,
	getFeatureStageLayoutKey,
	getLandingStageDevices,
	getLandingStageLayoutKey,
	getStageDeviceZIndex,
	LANDING_STAGE_SCALE_OPTIONS,
	resolveSlotPosition,
	STAGE_ARTBOARD,
	snapClusterScale
} from '@/lib/landing-stage-scale'

function findStageSlot(slots: ReturnType<typeof getLandingStageDevices>, id: string) {
	const slot = slots.find((s) => s.id === id)
	if (!slot) throw new Error(`Expected slot "${id}"`)
	return slot
}

describe('getLandingStageLayoutKey', () => {
	it('uses one default layout for hero and compact', () => {
		expect(getLandingStageLayoutKey('hero')).toBe('default')
		expect(getLandingStageLayoutKey('compact')).toBe('default')
	})

	it('alternates feature layouts for three deep slides', () => {
		expect(getFeatureStageLayoutKey(0)).toBe('iphone-left')
		expect(getFeatureStageLayoutKey(1)).toBe('ipad-left')
		expect(getFeatureStageLayoutKey(2)).toBe('iphone-left')
		expect(getLandingStageLayoutKey('editor', { featureIndex: 0 })).toBe('iphone-left')
		expect(getLandingStageLayoutKey('color', { featureIndex: 1 })).toBe('ipad-left')
		expect(getLandingStageLayoutKey('devices', { featureIndex: 2 })).toBe('iphone-left')
	})
})

describe('deviceRectArtboard', () => {
	it('places device center at artboard center plus px offsets', () => {
		const rect = deviceRectArtboard({ w: 100, h: 200, x: 120, y: -45 })
		expect(rect.cx).toBe(120)
		expect(rect.cy).toBe(-45)
		expect(rect.x).toBe(70)
		expect(rect.y).toBe(-145)
	})

	it('converts legacy fractions via resolveSlotPosition', () => {
		const pos = resolveSlotPosition({ w: 1, h: 1, left: 0.1, top: 0.2 })
		expect(pos.x).toBe(STAGE_ARTBOARD.w * 0.1)
		expect(pos.y).toBe(STAGE_ARTBOARD.h * 0.2)
	})
})

describe('feature layouts', () => {
	it('exposes tuned artboard positions per layout key', () => {
		const iphoneLeft = getLandingStageDevices('iphone-left')
		const ipadLeft = getLandingStageDevices('ipad-left')
		expect(resolveSlotPosition(findStageSlot(iphoneLeft, 'iphone')).x).toBe(420)
		expect(resolveSlotPosition(findStageSlot(ipadLeft, 'iphone')).x).toBe(-420)
	})
})

describe('computeLandingStageScale', () => {
	it('returns a scale that fits devices in a typical stage', () => {
		const slots = getLandingStageDevices('default')
		const scale = computeLandingStageScale(360, 225, slots, LANDING_STAGE_SCALE_OPTIONS)
		expect(scale).toBeGreaterThanOrEqual(0.05)
		expect(scale).toBeLessThanOrEqual(0.72)
	})

	it('returns smaller scale for narrow width than wide width', () => {
		const slots = getLandingStageDevices('iphone-left')
		const narrow = computeLandingStageScale(400, 250, slots, LANDING_STAGE_SCALE_OPTIONS)
		const wide = computeLandingStageScale(700, 437, slots, LANDING_STAGE_SCALE_OPTIONS)
		expect(wide).toBeGreaterThanOrEqual(narrow)
	})

	it('respects maxScale cap', () => {
		const slots = getLandingStageDevices('default').slice(0, 1)
		const scale = computeLandingStageScale(2000, 1200, slots, { maxScale: 0.4 })
		expect(scale).toBeLessThanOrEqual(0.4)
	})

	it('fits taller box better than flat box', () => {
		const slots = getLandingStageDevices('default')
		const flat = computeLandingStageScale(576, 259, slots, LANDING_STAGE_SCALE_OPTIONS)
		const tall = computeLandingStageScale(576, 360, slots, LANDING_STAGE_SCALE_OPTIONS)
		expect(tall).toBeGreaterThanOrEqual(flat)
	})

	it('keeps center offsets when scaleMult changes size', () => {
		const slots = getLandingStageDevices('iphone-left').map((slot) =>
			slot.id === 'ipad' ? { ...slot, x: 0, y: 0, scaleMult: 1.2 } : slot
		)
		const result = computeLandingStageScaleResult(800, 480, slots, { layoutKey: 'iphone-left' })
		const ipad = result.placed.find((d) => d.id === 'ipad')
		expect(ipad?.scaleMult).toBe(1.2)
	})

	it('includes z-index in placed devices', () => {
		const slots = getLandingStageDevices('iphone-left')
		const result = computeLandingStageScaleResult(800, 480, slots, { layoutKey: 'iphone-left' })
		expect(result.placed.find((d) => d.id === 'iphone')?.zIndex).toBe(2)
		expect(getStageDeviceZIndex({ id: 'ipad', zIndex: 2 })).toBe(2)
	})

	it('fits scaled cluster inside the container', () => {
		const result = computeLandingStageScaleResult(627, 392, getLandingStageDevices('default'), {
			...LANDING_STAGE_SCALE_OPTIONS,
			clusterScaleMult: 1,
			layoutKey: 'default'
		})
		expect(result.bbox).not.toBeNull()
		const bbox = result.bbox
		if (!bbox) return
		const { minX, maxX, minY, maxY } = bbox
		expect(minX).toBeGreaterThanOrEqual(0)
		expect(minY).toBeGreaterThanOrEqual(0)
		expect(maxX).toBeLessThanOrEqual(627)
		expect(maxY).toBeLessThanOrEqual(392)
	})

	it('fits feature layout inside a typical feature stage', () => {
		const slots = getLandingStageDevices('iphone-left')
		const result = computeLandingStageScaleResult(627, 470, slots, {
			...LANDING_STAGE_SCALE_OPTIONS,
			clusterScaleMult: 1,
			layoutKey: 'iphone-left'
		})
		expect(result.bbox).not.toBeNull()
		const bbox = result.bbox
		if (!bbox) return
		expect(bbox.maxY).toBeLessThanOrEqual(470)
		expect(bbox.minY).toBeGreaterThanOrEqual(0)
	})

	it('applies clusterScaleMult up to container fit', () => {
		const base = computeLandingStageScaleResult(627, 470, getLandingStageDevices('iphone-left'), {
			clusterScaleMult: 1,
			layoutKey: 'iphone-left'
		})
		const boosted = computeLandingStageScaleResult(627, 470, getLandingStageDevices('iphone-left'), {
			clusterScaleMult: 1.2,
			layoutKey: 'iphone-left'
		})
		expect(boosted.scale).toBeGreaterThanOrEqual(base.scale)
		expect(boosted.scale).toBeLessThanOrEqual(base.scale * 1.2 + 0.001)
	})

	it('snaps cluster scale to 0.01 and device positions to whole px', () => {
		const slots = getLandingStageDevices('ipad-left')
		const result = computeLandingStageScaleResult(800, 480, slots, { layoutKey: 'ipad-left' })
		expect(result.scale).toBe(Math.round(result.scale * 100) / 100)
		for (const device of result.placed) {
			expect(device.x).toBe(Math.round(device.x))
			expect(device.y).toBe(Math.round(device.y))
			expect(device.rotate).toBe(Math.round(device.rotate))
		}
	})

	it('keeps composition stable when only container aspect ratio changes', () => {
		const slots = getLandingStageDevices('iphone-left')
		const wide = computeLandingStageScaleResult(700, 350, slots)
		const tall = computeLandingStageScaleResult(700, 525, slots)
		expect(wide.placed).toEqual(tall.placed)
		expect(wide.composition).toEqual(tall.composition)
	})

	it('prefers a nearby scale with whole-pixel cluster metrics', () => {
		const snapped = snapClusterScale(0.2847, 2400, 2200, 800, 480, 0.05, 0.72)
		expect(snapped).toBe(0.28)
		expect(clusterPixelSnapScore(snapped, 2400, 2200, 800, 480)).toBeLessThan(
			clusterPixelSnapScore(0.2847, 2400, 2200, 800, 480)
		)
	})
})
