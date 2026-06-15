import { afterEach, describe, expect, it } from 'vitest'
import { isSiteNavItemActive, normalizeSitePath, toComparableSitePath } from '@/lib/site-paths'

describe('site nav active paths', () => {
	afterEach(() => {
		delete process.env.NEXT_PUBLIC_BASE_PATH
	})

	it('normalizes paths without a leading slash', () => {
		expect(normalizeSitePath('blog')).toBe('/blog')
		expect(normalizeSitePath('/blog/')).toBe('/blog')
		expect(normalizeSitePath('')).toBe('/')
	})

	it('marks Home and Blog active on their routes', () => {
		expect(isSiteNavItemActive('/', '/')).toBe(true)
		expect(isSiteNavItemActive('/blog', '/blog')).toBe(true)
		expect(isSiteNavItemActive('/blog/', '/blog')).toBe(true)
		expect(isSiteNavItemActive('blog', '/blog')).toBe(true)
		expect(isSiteNavItemActive('/rawclinic', '/')).toBe(false)
		expect(isSiteNavItemActive('/blog', '/')).toBe(false)
		expect(isSiteNavItemActive('/', '/blog')).toBe(false)
	})

	it('matches app routes', () => {
		expect(isSiteNavItemActive('/rawclinic/faq', '/rawclinic/faq')).toBe(true)
		expect(isSiteNavItemActive('/rawclinic/faq/', '/rawclinic/faq')).toBe(true)
		expect(isSiteNavItemActive('/rawclinic', '/rawclinic/faq')).toBe(false)
	})

	it('strips NEXT_PUBLIC_BASE_PATH before comparing', () => {
		process.env.NEXT_PUBLIC_BASE_PATH = '/apps'
		expect(toComparableSitePath('/apps/rawclinic/faq')).toBe('/rawclinic/faq')
		expect(isSiteNavItemActive('/apps', '/')).toBe(true)
		expect(isSiteNavItemActive('/apps/blog', '/blog')).toBe(true)
		expect(isSiteNavItemActive('/apps/rawclinic/faq', '/rawclinic/faq')).toBe(true)
	})
})
