import { describe, expect, it } from 'vitest'
import {
	MOCKUP_IPHONE,
	MOCKUP_SCREEN_EDGE_BLEED,
	MOCKUP_SCREEN_IPHONE,
	mockupScreenSlotStyle,
	resolveMockupSize
} from '@/lib/device-mockup-sizes'

describe('resolveMockupSize', () => {
	it('returns empty when both axes omitted', () => {
		expect(resolveMockupSize(MOCKUP_IPHONE)).toEqual({})
	})

	it('pairs height when only width is given', () => {
		const { width, height } = resolveMockupSize(MOCKUP_IPHONE, 769)
		expect(width).toBe(769)
		expect(height).toBe(MOCKUP_IPHONE.h)
	})

	it('pairs width when only height is given', () => {
		const { width, height } = resolveMockupSize(MOCKUP_IPHONE, undefined, 1603)
		expect(width).toBe(769)
		expect(height).toBe(1603)
	})
})

describe('mockupScreenSlotStyle', () => {
	it('positions screen slot as % of frame with edge bleed', () => {
		const bleed = MOCKUP_SCREEN_EDGE_BLEED
		const { x, y, w, h } = MOCKUP_SCREEN_IPHONE
		expect(mockupScreenSlotStyle(MOCKUP_SCREEN_IPHONE, MOCKUP_IPHONE)).toMatchObject({
			left: `${((x - bleed) / MOCKUP_IPHONE.w) * 100}%`,
			top: `${((y - bleed) / MOCKUP_IPHONE.h) * 100}%`,
			width: `${((w + bleed * 2) / MOCKUP_IPHONE.w) * 100}%`,
			height: `${((h + bleed * 2) / MOCKUP_IPHONE.h) * 100}%`
		})
	})
})
