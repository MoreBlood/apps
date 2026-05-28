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

	it('returns screenshot path for known apps', () => {
		expect(getAppPhoneScreenshotPath('rawclinic')).toBe('/screenshots/raw-clinic-1.PNG')
		expect(getAppPhoneScreenshotPath('rawclinic', 2)).toBe('/screenshots/raw-clinic-3.PNG')
		expect(getAppPhoneScreenshotPath('aqi-sense')).toBe('/screenshots/aqi-sense-1.PNG')
		expect(getAppPhoneScreenshotPath('aqi-sense', 1)).toBe('/screenshots/aqi-sense-2.PNG')
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

	it('returns tablet screenshots for known apps', () => {
		expect(getAppTabletScreenshotPath('rawclinic')).toBe('/screenshots/raw-clinic-1-ipad.png')
		expect(getAppTabletScreenshotPath('aqi-sense', 1)).toBe('/screenshots/aqi-sense-2-ipad.png')
	})
})

describe('getLandingStageScreenshots', () => {
	beforeEach(() => {
		process.env.NEXT_PUBLIC_BASE_PATH = ''
	})

	it('uses distinct phones in hero and last phone in compact', () => {
		const hero = getLandingStageScreenshots('rawclinic', 'hero')
		expect(hero.phone).toBe('/screenshots/raw-clinic-1.PNG')
		expect(hero.phoneSecondary).toBe('/screenshots/raw-clinic-2.PNG')
		expect(hero.tablet).toBe('/screenshots/raw-clinic-1-ipad.png')

		const compact = getLandingStageScreenshots('rawclinic', 'compact')
		expect(compact.phone).toBe('/screenshots/raw-clinic-3.PNG')
		expect(compact.tablet).toBe('/screenshots/raw-clinic-1-ipad.png')
	})

	it('maps feature visuals to screenshot indices', () => {
		expect(getLandingStageScreenshots('rawclinic', 'color').phone).toBe(
			'/screenshots/raw-clinic-2.PNG'
		)
		expect(getLandingStageScreenshots('aqi-sense', 'map').phone).toBe('/screenshots/aqi-sense-2.PNG')
		expect(getLandingStageScreenshots('aqi-sense', 'map').tablet).toBe(
			'/screenshots/aqi-sense-2-ipad.png'
		)
	})
})
