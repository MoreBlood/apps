import { describe, expect, it } from 'vitest'
import { centerPanelPosition } from '@/lib/landing-crack-window-geometry'

const workArea = { left: 100, top: 80, right: 900, bottom: 700 }

describe('landing-crack-window-geometry', () => {
	it('centers panel within work area', () => {
		const width = 200
		const height = 150
		const pos = centerPanelPosition(width, height, workArea)
		expect(pos.x).toBe(workArea.left + (workArea.right - workArea.left - width) / 2)
		expect(pos.y).toBe(workArea.top + (workArea.bottom - workArea.top - height) / 2)
	})
})
