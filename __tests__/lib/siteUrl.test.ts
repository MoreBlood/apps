import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('getBaseUrl', () => {
	const originalEnv = process.env

	beforeEach(() => {
		vi.resetModules()
		process.env = { ...originalEnv }
	})

	afterEach(() => {
		process.env = originalEnv
	})

	async function load() {
		const mod = await import('@/lib/siteUrl')
		return mod.getBaseUrl
	}

	it('returns fallback when NEXT_PUBLIC_SITE_URL is not set', async () => {
		delete process.env.NEXT_PUBLIC_SITE_URL
		delete process.env.NEXT_PUBLIC_BASE_PATH
		const getBaseUrl = await load()
		expect(getBaseUrl()).toBe('https://example.com')
	})

	it('returns site URL without trailing slash', async () => {
		process.env.NEXT_PUBLIC_SITE_URL = 'https://mysite.com/'
		delete process.env.NEXT_PUBLIC_BASE_PATH
		const getBaseUrl = await load()
		expect(getBaseUrl()).toBe('https://mysite.com')
	})

	it('appends basePath that already starts with /', async () => {
		process.env.NEXT_PUBLIC_SITE_URL = 'https://mysite.com'
		process.env.NEXT_PUBLIC_BASE_PATH = '/sub'
		const getBaseUrl = await load()
		expect(getBaseUrl()).toBe('https://mysite.com/sub')
	})

	it('adds leading slash to basePath when missing', async () => {
		process.env.NEXT_PUBLIC_SITE_URL = 'https://mysite.com'
		process.env.NEXT_PUBLIC_BASE_PATH = 'sub'
		const getBaseUrl = await load()
		expect(getBaseUrl()).toBe('https://mysite.com/sub')
	})

	it('returns base URL when basePath is empty string', async () => {
		process.env.NEXT_PUBLIC_SITE_URL = 'https://mysite.com'
		process.env.NEXT_PUBLIC_BASE_PATH = ''
		const getBaseUrl = await load()
		expect(getBaseUrl()).toBe('https://mysite.com')
	})
})
