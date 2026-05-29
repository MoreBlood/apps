import { describe, expect, it } from 'vitest'
import {
	clusterPixelSnapScore,
	computeLandingStageScale,
	computeLandingStageScaleResult,
	deviceRect,
	getLandingStageDevices,
	getLandingStageLayoutKey,
	getStageDeviceZIndex,
	LANDING_STAGE_SCALE_OPTIONS,
	snapClusterScale,
	stageOffsetXFraction
} from '@/lib/landing-stage-scale'

describe('getLandingStageLayoutKey', () => {
	it('uses hero-mobile below 768px', () => {
		expect(getLandingStageLayoutKey('hero', 767)).toBe('hero-mobile')
		expect(getLandingStageLayoutKey('hero', 769)).toBe('hero')
	})
})

describe('deviceRect', () => {
	it('places device center at viewport center plus % offsets', () => {
		const rect = deviceRect(800, 400, { w: 100, h: 200, left: 0.25, top: -0.1 }, 1)
		expect(rect.cx).toBe(800 / 2 + 0.25 * 800)
		expect(rect.cy).toBe(400 / 2 + -0.1 * 400)
		expect(rect.x).toBe(rect.cx - 50)
		expect(rect.y).toBe(rect.cy - 100)
	})
})

describe('computeLandingStageScale', () => {
	it('returns a scale that fits hero devices in a typical phone stage', () => {
		const slots = getLandingStageDevices('hero-mobile')
		const scale = computeLandingStageScale(360, 225, slots)
		expect(scale).toBeGreaterThanOrEqual(0.05)
		expect(scale).toBeLessThanOrEqual(0.56)
	})

	it('returns smaller scale for narrow width than wide width', () => {
		const slots = getLandingStageDevices('hero')
		const narrow = computeLandingStageScale(400, 250, slots)
		const wide = computeLandingStageScale(700, 437, slots)
		expect(wide).toBeGreaterThanOrEqual(narrow)
	})

	it('respects maxScale cap', () => {
		const slots = getLandingStageDevices('feature').slice(0, 1)
		const scale = computeLandingStageScale(2000, 1200, slots, { maxScale: 0.4 })
		expect(scale).toBeLessThanOrEqual(0.4)
	})

	it('fits compact layout in a taller 16:10 box better than a flat 20:9 box', () => {
		const slots = getLandingStageDevices('compact')
		const opts = { layoutKey: 'compact' as const, ...LANDING_STAGE_SCALE_OPTIONS.compact }
		const flat = computeLandingStageScale(576, 259, slots, opts)
		const tall = computeLandingStageScale(576, 360, slots, opts)
		expect(tall).toBeGreaterThanOrEqual(flat)
	})

	it('keeps center offsets when scaleMult changes size', () => {
		const slots = getLandingStageDevices('hero').map((slot) =>
			slot.id === 'ipad' ? { ...slot, left: 0, top: 0, scaleMult: 1.2 } : slot
		)
		const result = computeLandingStageScaleResult(800, 480, slots, { layoutKey: 'hero' })
		const ipad = result.placed.find((d) => d.id === 'ipad')!
		expect(ipad.scaleMult).toBe(1.2)
		expect(ipad.x).toBe(0)
		expect(ipad.y).toBe(0)
	})

	it('uses tuned hero device slots', () => {
		const slots = getLandingStageDevices('hero')
		const ipad = slots.find((s) => s.id === 'ipad')!
		const iphone = slots.find((s) => s.id === 'iphone')!
		expect(slots).toHaveLength(2)
		expect(stageOffsetXFraction(ipad)).toBe(0)
		expect(ipad.top).toBe(0)
		expect(ipad.zIndex).toBe(1)
		expect(stageOffsetXFraction(iphone)).toBe(0)
		expect(iphone.top).toBe(0)
		expect(iphone.zIndex).toBe(2)
	})

	it('includes z-index in placed devices', () => {
		const slots = getLandingStageDevices('hero')
		const result = computeLandingStageScaleResult(800, 480, slots, { layoutKey: 'hero' })
		expect(result.placed.find((d) => d.id === 'iphone')?.zIndex).toBe(2)
		expect(getStageDeviceZIndex({ id: 'ipad', zIndex: 2 })).toBe(2)
	})

	it('fits scaled devices inside the container', () => {
		const result = computeLandingStageScaleResult(627, 392, getLandingStageDevices('hero'))
		expect(result.bbox).not.toBeNull()
		const { minX, maxX, minY, maxY } = result.bbox!
		expect(minX).toBeGreaterThanOrEqual(0)
		expect(minY).toBeGreaterThanOrEqual(0)
		expect(maxX).toBeLessThanOrEqual(627)
		expect(maxY).toBeLessThanOrEqual(392)
	})

	it('fits feature layout inside a typical feature stage without exceeding height', () => {
		const slots = getLandingStageDevices('feature')
		const opts = { layoutKey: 'feature' as const, ...LANDING_STAGE_SCALE_OPTIONS.feature }
		const result = computeLandingStageScaleResult(627, 470, slots, opts)
		const scaledH = result.composition.h * result.scale
		expect(result.bbox).not.toBeNull()
		expect(result.bbox!.maxY).toBeLessThanOrEqual(470)
		expect(result.bbox!.minY).toBeGreaterThanOrEqual(0)
		expect(scaledH).toBeLessThanOrEqual(470 - result.padding * 2)
		expect(result.scale).toBeLessThanOrEqual(0.46)
	})

	it('fits compact layout in closing stage dimensions', () => {
		const slots = getLandingStageDevices('compact')
		const opts = { layoutKey: 'compact' as const, ...LANDING_STAGE_SCALE_OPTIONS.compact }
		const result = computeLandingStageScaleResult(576, 360, slots, opts)
		expect(result.bbox!.maxY).toBeLessThanOrEqual(360)
		expect(result.bbox!.minY).toBeGreaterThanOrEqual(0)
	})

	it('snaps cluster scale to 0.01 and layout fractions to 0.01', () => {
		const slots = getLandingStageDevices('hero')
		const result = computeLandingStageScaleResult(800, 480, slots, { layoutKey: 'hero' })
		expect(result.scale).toBe(Math.round(result.scale * 100) / 100)
		for (const device of result.placed) {
			expect(device.x).toBe(Math.round(device.x * 100) / 100)
			expect(device.y).toBe(Math.round(device.y * 100) / 100)
			expect(device.rotate).toBe(Math.round(device.rotate))
		}
	})

	it('prefers a nearby scale with whole-pixel cluster metrics', () => {
		const snapped = snapClusterScale(0.3847, 1200, 900, 800, 480, 0.12, 0.56)
		expect(snapped).toBe(0.38)
		expect(clusterPixelSnapScore(snapped, 1200, 900, 800, 480)).toBeLessThan(
			clusterPixelSnapScore(0.3847, 1200, 900, 800, 480)
		)
	})
})
