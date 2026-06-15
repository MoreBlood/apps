import { describe, expect, it } from 'vitest'
import {
	getMacClassic9DesktopIconId,
	getMacClassic9FinderIconId,
	macClassic9IconSrc
} from '@/config/landing-mac-classic-icons'

describe('landing-mac-classic-icons', () => {
	it('builds public paths by icon id', () => {
		expect(macClassic9IconSrc(24)).toBe('/landing/mac-classic-9/24.png')
	})

	it('maps desktop kinds and overrides', () => {
		expect(getMacClassic9DesktopIconId('folder', 'luts')).toBe(24)
		expect(getMacClassic9DesktopIconId('sys', 'finder-hd')).toBe(4)
		expect(getMacClassic9DesktopIconId('app', 'app')).toBeNull()
	})

	it('maps finder row kinds', () => {
		expect(getMacClassic9FinderIconId('jpg')).toBe(77)
	})
})
