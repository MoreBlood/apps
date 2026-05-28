import { describe, expect, it } from 'vitest'
import { MOCKUP_IPHONE, resolveDeviceFramesetSize } from '@/lib/device-mockup-sizes'

describe('resolveDeviceFramesetSize', () => {
	it('returns empty when both axes omitted (native CSS size)', () => {
		expect(resolveDeviceFramesetSize('iPhone X')).toEqual({})
	})

	it('pairs height when only width is given', () => {
		const { width, height } = resolveDeviceFramesetSize('iPhone X', 375)
		expect(width).toBe(375)
		expect(height).toBe(MOCKUP_IPHONE.h)
	})

	it('pairs width when only height is given', () => {
		const { width, height } = resolveDeviceFramesetSize('iPad Mini', undefined, 768)
		expect(width).toBe(576)
		expect(height).toBe(768)
	})
})
