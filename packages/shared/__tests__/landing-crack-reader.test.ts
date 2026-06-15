import { describe, expect, it } from 'vitest'
import { getReaderDoc } from '@/config/landing-crack-reader'

describe('landing-crack-reader', () => {
	it('loads readme by id', () => {
		const doc = getReaderDoc('rawclinic', 'readme')
		expect(doc?.filename).toBe('README_HONEST.txt')
		expect(doc?.lines.length).toBeGreaterThan(0)
	})
})
