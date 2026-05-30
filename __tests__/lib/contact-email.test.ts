import { describe, expect, it } from 'vitest'
import { contactEmailMailto, formatContactEmailDisplay } from '@/lib/contact-email'

describe('formatContactEmailDisplay', () => {
	it('strips a plus-tag from the local part', () => {
		expect(formatContactEmailDisplay('artihovich.it+rawclinic@gmail.com')).toBe('artihovich.it@gmail.com')
		expect(formatContactEmailDisplay('artihovich.it+aqisense@gmail.com')).toBe('artihovich.it@gmail.com')
	})

	it('leaves addresses without a plus-tag unchanged', () => {
		expect(formatContactEmailDisplay('hello@example.com')).toBe('hello@example.com')
	})
})

describe('contactEmailMailto', () => {
	it('keeps the full address in the href', () => {
		expect(contactEmailMailto('artihovich.it+rawclinic@gmail.com')).toBe('mailto:artihovich.it+rawclinic@gmail.com')
	})
})
