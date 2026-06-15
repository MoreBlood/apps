import { describe, expect, it } from 'vitest'
import { focusWindowInStack, getFocusedWindow, getWindowStackZIndex } from '@/lib/landing-crack-window-stack'

describe('landing-crack-window-stack', () => {
	it('brings focused window to front', () => {
		const initial: ('main' | 'audio')[] = ['audio', 'main']
		expect(getFocusedWindow(initial)).toBe('main')
		expect(getWindowStackZIndex(initial, 'audio')).toBeLessThan(getWindowStackZIndex(initial, 'main'))

		const next = focusWindowInStack(initial, 'audio')
		expect(getFocusedWindow(next)).toBe('audio')
		expect(getWindowStackZIndex(next, 'audio')).toBeGreaterThan(getWindowStackZIndex(next, 'main'))
	})

	it('boosts z-index while dragging', () => {
		const stack: ('main' | 'audio')[] = ['audio', 'main']
		expect(getWindowStackZIndex(stack, 'main', true)).toBeGreaterThan(getWindowStackZIndex(stack, 'main'))
	})
})
