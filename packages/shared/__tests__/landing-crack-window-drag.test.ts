import { describe, expect, it } from 'vitest'
import { clampPosition } from '@/lib/landing-crack-window-drag'

const workArea = { left: 100, top: 80, right: 900, bottom: 700 }

describe('landing-crack-window-drag', () => {
	it('clamps within work area with padding', () => {
		const pad = 8
		expect(clampPosition(0, 0, 200, 150, workArea)).toEqual({
			x: workArea.left + pad,
			y: workArea.top + pad
		})
		expect(clampPosition(9999, 9999, 200, 150, workArea)).toEqual({
			x: workArea.right - 200 - pad,
			y: workArea.bottom - 150 - pad
		})
	})

	it('falls back to viewport padding when work area is null', () => {
		const w = 100
		const h = 80
		const result = clampPosition(0, 0, w, h, null)
		expect(result.x).toBe(8)
		expect(result.y).toBe(8)
	})
})
