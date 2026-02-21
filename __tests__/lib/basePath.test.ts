import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('assetPath', () => {
	beforeEach(() => {
		vi.resetModules()
	})

	async function load() {
		const mod = await import('@/lib/basePath')
		return mod.assetPath
	}

	it('prepends basePath from env to a path starting with /', async () => {
		process.env.NEXT_PUBLIC_BASE_PATH = '/app'
		const assetPath = await load()
		expect(assetPath('/logo.svg')).toBe('/app/logo.svg')
	})

	it('adds leading slash when path does not start with /', async () => {
		process.env.NEXT_PUBLIC_BASE_PATH = ''
		const assetPath = await load()
		expect(assetPath('logo.svg')).toBe('/logo.svg')
	})

	it('returns path as-is with leading slash when no basePath', async () => {
		process.env.NEXT_PUBLIC_BASE_PATH = ''
		const assetPath = await load()
		expect(assetPath('/images/icon.png')).toBe('/images/icon.png')
	})
})
