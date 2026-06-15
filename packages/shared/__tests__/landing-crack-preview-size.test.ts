import { describe, expect, it } from 'vitest'
import { computePreviewLayout } from '@/lib/landing-crack-preview-size'

describe('landing-crack-preview-size', () => {
	it('fits image aspect ratio into window chrome', () => {
		const { window, image } = computePreviewLayout(400, 300)
		expect(image.width).toBeLessThanOrEqual(400)
		expect(image.height).toBeLessThanOrEqual(300)
		expect(window.width).toBeGreaterThan(image.width)
		expect(window.height).toBeGreaterThan(image.height)
	})

	it('scales down large images', () => {
		const { image } = computePreviewLayout(4000, 3000)
		expect(image.width).toBeLessThan(4000)
		expect(image.height).toBeLessThan(3000)
		expect(image.width / image.height).toBeCloseTo(4000 / 3000, 1)
	})
})
