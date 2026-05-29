import { describe, expect, it } from 'vitest'
import { MOCKUP_IPHONE, resolveMockupSize } from '@/lib/device-mockup-sizes'

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
