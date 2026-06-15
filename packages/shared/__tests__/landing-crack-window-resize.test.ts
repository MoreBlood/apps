import { describe, expect, it } from 'vitest'
import { clampSize, getMaxPanelSize } from '@/lib/landing-crack-window-resize'

const workArea = { left: 100, top: 80, right: 900, bottom: 700 }

describe('landing-crack-window-resize', () => {
	it('clamps size within work area', () => {
		const max = getMaxPanelSize(workArea)
		expect(max.width).toBe(900 - 100 - 16)
		expect(clampSize(50, 50, 200, 120, workArea)).toEqual({ width: 200, height: 120 })
		expect(clampSize(9999, 9999, 200, 120, workArea)).toEqual(max)
	})
})
