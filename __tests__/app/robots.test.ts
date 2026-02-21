import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/siteUrl', () => ({ getBaseUrl: vi.fn() }))

import { getBaseUrl } from '@/lib/siteUrl'
import robots from '@/app/robots'

const mockGetBaseUrl = vi.mocked(getBaseUrl)

describe('robots', () => {
	beforeEach(() => {
		mockGetBaseUrl.mockReturnValue('https://mysite.com')
	})

	it('allows all user agents', () => {
		const result = robots()
		const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules
		expect(rule.userAgent).toBe('*')
		expect(rule.allow).toBe('/')
	})

	it('sets sitemap URL using base URL', () => {
		const result = robots()
		expect(result.sitemap).toBe('https://mysite.com/sitemap.xml')
	})

	it('reflects different base URLs', () => {
		mockGetBaseUrl.mockReturnValue('https://other.com/sub')
		const result = robots()
		expect(result.sitemap).toBe('https://other.com/sub/sitemap.xml')
	})
})
