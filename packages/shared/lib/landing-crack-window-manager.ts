'use client'

import { useCallback, useMemo, useState } from 'react'
import { createInitialFloatingGeometry, INITIAL_WINDOW_STACK } from '@/config/landing-crack-initial-desktop'
import type { SavedWindowGeometry } from '@/lib/landing-crack-window-geometry'

export type CrackWindowId = 'main' | 'audio' | 'finder' | 'preview' | 'reader'

export type WindowChromeState = 'normal' | 'minimized' | 'maximized' | 'closed'

export type CrackWindowRecord = {
	chrome: WindowChromeState
}

export type StoredWindowGeometry = SavedWindowGeometry & {
	customized: boolean
}

export type CrackDesktopState = {
	stack: CrackWindowId[]
	windows: Record<CrackWindowId, CrackWindowRecord>
	geometry: Partial<Record<CrackWindowId, StoredWindowGeometry>>
}

/** Base z-index for the lowest window in the stack. */
const BASE_Z = 24
/** Extra z-index added to the window being dragged. Must stay below shell chrome (100). */
const DRAG_Z_BOOST = 48

export function createInitialCrackDesktopState(): CrackDesktopState {
	return {
		stack: [...INITIAL_WINDOW_STACK],
		windows: {
			main: { chrome: 'normal' },
			audio: { chrome: 'normal' },
			finder: { chrome: 'normal' },
			preview: { chrome: 'normal' },
			reader: { chrome: 'normal' }
		},
		geometry: createInitialFloatingGeometry()
	}
}

export function focusWindowInStack(stack: CrackWindowId[], id: CrackWindowId): CrackWindowId[] {
	return [...stack.filter((w) => w !== id), id]
}

export function getFocusedWindow(stack: CrackWindowId[]): CrackWindowId | null {
	return stack[stack.length - 1] ?? null
}

export function getWindowStackZIndex(stack: CrackWindowId[], id: CrackWindowId, dragging = false): number {
	const index = stack.indexOf(id)
	const order = index >= 0 ? index : 0
	return BASE_Z + order * 2 + (dragging ? DRAG_Z_BOOST : 0)
}

export function isWindowVisible(chrome: WindowChromeState): boolean {
	return chrome !== 'closed'
}

export function isWindowRunning(chrome: WindowChromeState): boolean {
	return chrome !== 'closed' && chrome !== 'minimized'
}

export function useCrackWindowManager(initial?: CrackDesktopState) {
	const [state, setState] = useState<CrackDesktopState>(initial ?? createInitialCrackDesktopState)

	const focusedId = getFocusedWindow(state.stack)

	const getWindow = useCallback((id: CrackWindowId) => state.windows[id], [state.windows])

	const getChrome = useCallback((id: CrackWindowId) => state.windows[id].chrome, [state.windows])

	const getZIndex = useCallback(
		(id: CrackWindowId, dragging = false) => getWindowStackZIndex(state.stack, id, dragging),
		[state.stack]
	)

	const isFocused = useCallback((id: CrackWindowId) => focusedId === id, [focusedId])

	const isVisible = useCallback((id: CrackWindowId) => isWindowVisible(state.windows[id].chrome), [state.windows])

	const isRunning = useCallback((id: CrackWindowId) => isWindowRunning(state.windows[id].chrome), [state.windows])

	const isActive = useCallback((id: CrackWindowId) => isFocused(id) && isRunning(id), [isFocused, isRunning])

	const bringToFront = useCallback((stack: CrackWindowId[], id: CrackWindowId) => {
		const withId = stack.includes(id) ? stack : [...stack, id]
		return focusWindowInStack(withId, id)
	}, [])

	const activate = useCallback(
		(id: CrackWindowId) => {
			setState((prev) => {
				const current = prev.windows[id]
				let chrome = current.chrome
				if (chrome === 'minimized' || chrome === 'closed') chrome = 'normal'
				return {
					...prev,
					stack: bringToFront(prev.stack, id),
					windows: {
						...prev.windows,
						[id]: { ...current, chrome }
					}
				}
			})
		},
		[bringToFront]
	)

	const openWindow = useCallback(
		(id: CrackWindowId) => {
			setState((prev) => ({
				stack: bringToFront(prev.stack, id),
				windows: {
					...prev.windows,
					[id]: { ...prev.windows[id], chrome: 'normal' }
				},
				geometry: prev.geometry ?? {}
			}))
		},
		[bringToFront]
	)

	const getWindowGeometry = useCallback((id: CrackWindowId) => state.geometry?.[id] ?? null, [state.geometry])

	const isWindowGeometryCustomized = useCallback(
		(id: CrackWindowId) => state.geometry?.[id]?.customized === true,
		[state.geometry]
	)

	const saveWindowGeometry = useCallback((id: CrackWindowId, geometry: SavedWindowGeometry, customized = true) => {
		setState((prev) => ({
			...prev,
			geometry: {
				...(prev.geometry ?? {}),
				[id]: { ...geometry, customized }
			}
		}))
	}, [])

	const setChrome = useCallback((id: CrackWindowId, chrome: WindowChromeState) => {
		setState((prev) => ({
			...prev,
			windows: {
				...prev.windows,
				[id]: { ...prev.windows[id], chrome }
			}
		}))
	}, [])

	const toggleMaximize = useCallback(
		(id: CrackWindowId) => {
			setState((prev) => {
				const current = prev.windows[id]
				const chrome = current.chrome === 'maximized' ? 'normal' : 'maximized'
				return {
					...prev,
					stack: bringToFront(prev.stack, id),
					windows: {
						...prev.windows,
						[id]: { ...current, chrome }
					}
				}
			})
		},
		[bringToFront]
	)

	return useMemo(
		() => ({
			state,
			stack: state.stack,
			focusedId,
			getWindow,
			getChrome,
			getZIndex,
			isFocused,
			isVisible,
			isRunning,
			isActive,
			activate,
			openWindow,
			setChrome,
			toggleMaximize,
			getWindowGeometry,
			isWindowGeometryCustomized,
			saveWindowGeometry
		}),
		[
			state,
			focusedId,
			getWindow,
			getChrome,
			getZIndex,
			isFocused,
			isVisible,
			isRunning,
			isActive,
			activate,
			openWindow,
			setChrome,
			toggleMaximize,
			getWindowGeometry,
			isWindowGeometryCustomized,
			saveWindowGeometry
		]
	)
}

export type CrackWindowManager = ReturnType<typeof useCrackWindowManager>
