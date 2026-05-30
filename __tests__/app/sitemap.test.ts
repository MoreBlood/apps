import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/siteUrl', () => ({ getBaseUrl: vi.fn() }))
vi.mock('@/config', () => ({
	getApps: vi.fn()
}))

import sitemap from '@/app/sitemap'
import { getApps } from '@/config'
import { getBaseUrl } from '@/lib/siteUrl'

const mockGetBaseUrl = vi.mocked(getBaseUrl)
const mockGetApps = vi.mocked(getApps)

describe('sitemap', () => {
	beforeEach(() => {
		mockGetBaseUrl.mockReturnValue('https://mysite.com')
		mockGetApps.mockReturnValue([
			{
				slug: 'my-app',
				appName: 'My App',
				tagline: 'tagline',
				description: 'desc',
				contactEmail: 'test@test.com',
				lastUpdated: '2025-01-01',
				accentColor: 'blue' as const
			}
		])
	})

	it('always includes root URL with priority 1', () => {
		const entries = sitemap()
		const root = entries.find((e) => e.url === 'https://mysite.com/')
		expect(root).toBeDefined()
		expect(root?.priority).toBe(1)
	})

	it('generates six entries per app', () => {
		const entries = sitemap()
		const appEntries = entries.filter((e) => e.url.includes('/my-app/'))
		expect(appEntries).toHaveLength(6)
	})

	it('includes correct app sub-routes', () => {
		const entries = sitemap()
		const urls = entries.map((e) => e.url)
		expect(urls).toContain('https://mysite.com/my-app/')
		expect(urls).toContain('https://mysite.com/my-app/roadmap/')
		expect(urls).toContain('https://mysite.com/my-app/faq/')
		expect(urls).toContain('https://mysite.com/my-app/privacy/')
		expect(urls).toContain('https://mysite.com/my-app/terms/')
		expect(urls).toContain('https://mysite.com/my-app/feedback/')
	})

	it('uses getBaseUrl result as base for all URLs', () => {
		mockGetBaseUrl.mockReturnValue('https://other.com/base')
		const entries = sitemap()
		expect(entries[0].url).toContain('https://other.com/base')
	})
})
