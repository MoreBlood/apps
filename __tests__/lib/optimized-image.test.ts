import { beforeEach, describe, expect, it, vi } from 'vitest'
import { resolveOptimizedImage } from '@/lib/optimized-image'

describe('normalizeImageKey', () => {
	beforeEach(() => {
		process.env.NEXT_PUBLIC_BASE_PATH = ''
	})

	it('strips basePath prefix', async () => {
		vi.resetModules()
		process.env.NEXT_PUBLIC_BASE_PATH = '/app'
		const { normalizeImageKey: load } = await import('@/lib/optimized-image')
		expect(load('/app/screenshots/raw-clinic-1.PNG')).toBe('/screenshots/raw-clinic-1.PNG')
	})
})

describe('resolveOptimizedImage', () => {
	beforeEach(() => {
		process.env.NEXT_PUBLIC_BASE_PATH = ''
	})

	it('returns WebP asset for known screenshots', () => {
		const resolved = resolveOptimizedImage('/screenshots/raw-clinic-1.PNG')
		expect(resolved.src).toBe('/screenshots/opt/raw-clinic-1.webp')
		expect(resolved.width).toBeGreaterThan(0)
		expect(resolved.blurDataURL.startsWith('data:image/jpeg;base64,')).toBe(true)
	})

	it('falls back to original path when unknown', () => {
		const resolved = resolveOptimizedImage('/screenshots/missing.png')
		expect(resolved.src).toBe('/screenshots/missing.png')
	})
})
