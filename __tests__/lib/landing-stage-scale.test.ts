import { describe, expect, it } from 'vitest'
import {
	computeLandingStageScale,
	computeLandingStageScaleResult,
	getLandingStageDevices,
	getLandingStageLayoutKey,
	getStageDeviceZIndex,
	LANDING_STAGE_SCALE_OPTIONS
} from '@/lib/landing-stage-scale'

describe('getLandingStageLayoutKey', () => {
	it('uses hero-mobile below 520px', () => {
		expect(getLandingStageLayoutKey('hero', 519)).toBe('hero-mobile')
		expect(getLandingStageLayoutKey('hero', 521)).toBe('hero')
	})
})

describe('computeLandingStageScale', () => {
	it('returns a scale that fits hero devices in a typical phone stage', () => {
		const slots = getLandingStageDevices('hero-mobile')
		const scale = computeLandingStageScale(360, 225, slots)
		expect(scale).toBeGreaterThanOrEqual(0.22)
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
		expect(tall).toBeGreaterThan(flat)
	})

	it('offsets placed position when scaleMult scales from center', () => {
		const slots = getLandingStageDevices('hero').map((slot) =>
			slot.id === 'ipad' ? { ...slot, left: 0, top: 0, scaleMult: 1.2 } : slot
		)
		const result = computeLandingStageScaleResult(800, 480, slots, { layoutKey: 'hero' })
		const ipad = result.placed.find((d) => d.id === 'ipad')!
		expect(ipad.scaleMult).toBe(1.2)
		expect(ipad.x).toBeGreaterThan(0)
	})

	it('uses tuned hero device slots', () => {
		const slots = getLandingStageDevices('hero')
		const ipad = slots.find((s) => s.id === 'ipad')!
		const iphone = slots.find((s) => s.id === 'iphone')!
		const secondary = slots.find((s) => s.id === 'iphone-secondary')!
		expect(ipad.left).toBe(0.77)
		expect(ipad.top).toBe(-0.06)
		expect(ipad.scaleMult).toBe(1.2)
		expect(ipad.zIndex).toBe(2)
		expect(iphone.left).toBe(0.615)
		expect(iphone.top).toBe(0.5)
		expect(secondary.zIndex).toBe(0)
	})

	it('includes z-index in placed devices', () => {
		const slots = getLandingStageDevices('hero')
		const result = computeLandingStageScaleResult(800, 480, slots, { layoutKey: 'hero' })
		expect(result.placed.find((d) => d.id === 'iphone')?.zIndex).toBe(2)
		expect(getStageDeviceZIndex({ id: 'ipad', zIndex: 2 })).toBe(2)
	})

	it('centers the scaled composition in the container', () => {
		const result = computeLandingStageScaleResult(627, 392, getLandingStageDevices('hero'))
		expect(result.bbox).not.toBeNull()
		const { minX, maxX, minY, maxY } = result.bbox!
		const marginX = minX - (627 - (maxX - minX)) / 2
		const marginY = minY - (392 - (maxY - minY)) / 2
		expect(Math.abs(marginX)).toBeLessThanOrEqual(2)
		expect(Math.abs(marginY)).toBeLessThanOrEqual(2)
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
})
