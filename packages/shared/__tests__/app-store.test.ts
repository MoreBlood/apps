import { describe, expect, it } from 'vitest'
import { getAppleItunesAppMeta, getAppStoreId } from '@/lib/app-store'

describe('app-store', () => {
	it('extracts numeric id from App Store URL', () => {
		expect(getAppStoreId('https://apps.apple.com/app/raw-clinic/id6755300857')).toBe('6755300857')
	})

	it('builds Smart App Banner meta', () => {
		expect(
			getAppleItunesAppMeta('https://apps.apple.com/us/app/aqi-sense/id6759257996', 'https://example.com/aqi-sense/')
		).toBe('app-id=6759257996, app-argument=https://example.com/aqi-sense/')
	})

	it('returns undefined without store link', () => {
		expect(getAppStoreId(undefined)).toBeUndefined()
		expect(getAppleItunesAppMeta(undefined)).toBeUndefined()
	})
})
