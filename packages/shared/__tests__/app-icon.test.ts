import { describe, expect, it } from 'vitest'
import { getAppIconPath } from '@/lib/app-icon'

describe('getAppIconPath', () => {
	it('maps known app slugs to icon files', () => {
		expect(getAppIconPath('rawclinic')).toBe('/icons/raw-clinic.png')
		expect(getAppIconPath('aqi-sense')).toBe('/icons/aqi-sense.png')
	})

	it('falls back to slug-based path for unknown apps', () => {
		expect(getAppIconPath('future-app')).toBe('/icons/future-app.png')
	})
})
