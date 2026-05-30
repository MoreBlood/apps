import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('siteUrl', () => {
	const originalEnv = process.env

	beforeEach(() => {
		vi.resetModules()
		process.env = { ...originalEnv }
	})

	afterEach(() => {
		process.env = originalEnv
	})

	async function load() {
		return import('@/lib/siteUrl')
	}

	it('uses NEXT_PUBLIC_SITE_URL when set', async () => {
		process.env.NEXT_PUBLIC_SITE_URL = 'https://mysite.com/'
		delete process.env.GITHUB_REPOSITORY
		delete process.env.NEXT_PUBLIC_BASE_PATH
		const { getBaseUrl } = await load()
		expect(getBaseUrl()).toBe('https://mysite.com')
	})

	it('derives origin from GITHUB_REPOSITORY for project pages', async () => {
		delete process.env.NEXT_PUBLIC_SITE_URL
		process.env.GITHUB_REPOSITORY = 'moreblood/apps'
		process.env.NEXT_PUBLIC_BASE_PATH = '/apps'
		const { getBaseUrl } = await load()
		expect(getBaseUrl()).toBe('https://moreblood.github.io/apps')
	})

	it('uses localhost in development without env', async () => {
		vi.stubEnv('NODE_ENV', 'development')
		delete process.env.NEXT_PUBLIC_SITE_URL
		delete process.env.GITHUB_REPOSITORY
		delete process.env.NEXT_PUBLIC_BASE_PATH
		const { getBaseUrl } = await load()
		expect(getBaseUrl()).toBe('http://localhost:3000')
	})

	it('falls back to example.com in production without env', async () => {
		vi.stubEnv('NODE_ENV', 'production')
		delete process.env.NEXT_PUBLIC_SITE_URL
		delete process.env.GITHUB_REPOSITORY
		delete process.env.NEXT_PUBLIC_BASE_PATH
		const { getBaseUrl } = await load()
		expect(getBaseUrl()).toBe('https://example.com')
	})

	it('metadataBase includes deploy basePath', async () => {
		process.env.NEXT_PUBLIC_SITE_URL = 'https://moreblood.github.io'
		process.env.NEXT_PUBLIC_BASE_PATH = '/apps'
		const { getMetadataBase } = await load()
		expect(getMetadataBase().href).toBe('https://moreblood.github.io/apps/')
	})
})
