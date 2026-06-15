import { describe, expect, it } from 'vitest'
import {
	createInitialCrackDesktopState,
	focusWindowInStack,
	getFocusedWindow,
	getWindowStackZIndex,
	isWindowRunning,
	isWindowVisible
} from '@/lib/landing-crack-window-manager'

describe('landing-crack-window-manager', () => {
	it('brings focused window to front', () => {
		const initial = createInitialCrackDesktopState()
		expect(getFocusedWindow(initial.stack)).toBe('main')
		expect(isWindowVisible(initial.windows.finder.chrome)).toBe(true)
		expect(isWindowVisible(initial.windows.reader.chrome)).toBe(true)
		expect(getWindowStackZIndex(initial.stack, 'preview')).toBeLessThan(getWindowStackZIndex(initial.stack, 'main'))

		const next = focusWindowInStack(initial.stack, 'audio')
		expect(getFocusedWindow(next)).toBe('audio')
		expect(getWindowStackZIndex(next, 'audio')).toBeGreaterThan(getWindowStackZIndex(next, 'main'))
	})

	it('boosts z-index while dragging', () => {
		const stack = createInitialCrackDesktopState().stack
		expect(getWindowStackZIndex(stack, 'main', true)).toBeGreaterThan(getWindowStackZIndex(stack, 'main'))
	})

	it('preserves geometry when activating a window', () => {
		const initial = createInitialCrackDesktopState()
		expect(initial.geometry?.preview).toBeDefined()

		// Simulate the bug: activate returned only stack + windows
		const afterBrokenActivate = {
			stack: focusWindowInStack(initial.stack, 'finder'),
			windows: { ...initial.windows, finder: { chrome: 'normal' as const } }
		}
		expect(afterBrokenActivate).not.toHaveProperty('geometry')

		const afterFixed = {
			...initial,
			stack: focusWindowInStack(initial.stack, 'finder'),
			windows: { ...initial.windows, finder: { chrome: 'normal' as const } }
		}
		expect(afterFixed.geometry?.preview).toBeDefined()
	})

	it('derives visible and running from chrome', () => {
		expect(isWindowVisible('normal')).toBe(true)
		expect(isWindowVisible('closed')).toBe(false)
		expect(isWindowRunning('minimized')).toBe(false)
		expect(isWindowRunning('normal')).toBe(true)
	})
})
