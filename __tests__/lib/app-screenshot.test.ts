import { describe, expect, it, beforeEach, vi } from 'vitest'
import {
	getAppPhoneScreenshotPath,
	getAppTabletScreenshotPath,
	getLandingStageScreenshots
} from '@/lib/app-screenshot'

describe('getAppPhoneScreenshotPath', () => {
	beforeEach(() => {
		process.env.NEXT_PUBLIC_BASE_PATH = ''
	})

	it('returns hero iphone for known apps', () => {
		expect(getAppPhoneScreenshotPath('rawclinic')).toBe('/screenshots/raw-clinic-1.PNG')
		expect(getAppPhoneScreenshotPath('aqi-sense')).toBe('/screenshots/aqi-sense-1.PNG')
	})

	it('returns undefined for unknown apps', () => {
		expect(getAppPhoneScreenshotPath('unknown')).toBeUndefined()
	})

	it('prepends basePath when set', async () => {
		vi.resetModules()
		process.env.NEXT_PUBLIC_BASE_PATH = '/app'
		const { getAppPhoneScreenshotPath: load } = await import('@/lib/app-screenshot')
		expect(load('rawclinic')).toBe('/app/screenshots/raw-clinic-1.PNG')
	})
})

describe('getAppTabletScreenshotPath', () => {
	beforeEach(() => {
		process.env.NEXT_PUBLIC_BASE_PATH = ''
	})

	it('returns hero ipad for known apps', () => {
		expect(getAppTabletScreenshotPath('rawclinic')).toBe('/screenshots/raw-clinic-1-ipad.png')
		expect(getAppTabletScreenshotPath('aqi-sense')).toBe('/screenshots/aqi-sense-1-ipad.png')
	})
})

describe('getLandingStageScreenshots', () => {
	beforeEach(() => {
		process.env.NEXT_PUBLIC_BASE_PATH = ''
	})

	it('resolves hero and closing sections', () => {
		const hero = getLandingStageScreenshots('rawclinic', 'hero')
		expect(hero.phone).toBe('/screenshots/raw-clinic-1.PNG')
		expect(hero.phoneSecondary).toBe('/screenshots/raw-clinic-2.PNG')
		expect(hero.tablet).toBe('/screenshots/raw-clinic-1-ipad.png')

		const closing = getLandingStageScreenshots('rawclinic', 'compact')
		expect(closing.phone).toBe('/screenshots/raw-clinic-3.PNG')
		expect(closing.tablet).toBe('/screenshots/raw-clinic-1-ipad.png')
	})

	it('resolves per-feature screenshots', () => {
		expect(getLandingStageScreenshots('rawclinic', 'color').phone).toBe(
			'/screenshots/raw-clinic-2.PNG'
		)
		expect(getLandingStageScreenshots('aqi-sense', 'map').phone).toBe('/screenshots/aqi-sense-2.PNG')
		expect(getLandingStageScreenshots('aqi-sense', 'map').tablet).toBe(
			'/screenshots/aqi-sense-2-ipad.png'
		)
	})
})
