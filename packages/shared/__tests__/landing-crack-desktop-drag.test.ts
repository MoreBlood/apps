import { describe, expect, it } from 'vitest'
import { isDesktopIconClick, parseCssPercent, toCssPercent } from '@/lib/landing-crack-desktop-drag'

describe('landing-crack-desktop-drag', () => {
	it('converts percent positions against container size', () => {
		expect(parseCssPercent('10%', 500)).toBe(50)
		expect(toCssPercent(50, 500)).toBe('10%')
	})

	it('clamps percent to desktop bounds', () => {
		expect(toCssPercent(999, 500)).toBe('100%')
		expect(toCssPercent(0, 500)).toBe('0%')
	})

	it('distinguishes click from drag', () => {
		expect(isDesktopIconClick(2)).toBe(true)
		expect(isDesktopIconClick(12)).toBe(false)
	})
})
