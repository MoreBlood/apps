'use client'

import { useCallback, useState } from 'react'

export type CrackWindowId = 'main' | 'audio'

const BASE_Z = 24
const DRAG_Z_BOOST = 48

export function focusWindowInStack(stack: CrackWindowId[], id: CrackWindowId): CrackWindowId[] {
	return [...stack.filter((w) => w !== id), id]
}

export function getWindowStackZIndex(stack: CrackWindowId[], id: CrackWindowId, dragging = false): number {
	const index = stack.indexOf(id)
	const order = index >= 0 ? index : 0
	return BASE_Z + order * 2 + (dragging ? DRAG_Z_BOOST : 0)
}

export function getFocusedWindow(stack: CrackWindowId[]): CrackWindowId | null {
	return stack[stack.length - 1] ?? null
}

export function useCrackWindowStack(initial: CrackWindowId[] = ['audio', 'main']) {
	const [stack, setStack] = useState<CrackWindowId[]>(initial)

	const focusWindow = useCallback((id: CrackWindowId) => {
		setStack((prev) => focusWindowInStack(prev, id))
	}, [])

	const getWindowZIndex = useCallback(
		(id: CrackWindowId, dragging = false) => getWindowStackZIndex(stack, id, dragging),
		[stack]
	)

	const isWindowFocused = useCallback((id: CrackWindowId) => getFocusedWindow(stack) === id, [stack])

	const topWindow = getFocusedWindow(stack)

	return { stack, focusWindow, getWindowZIndex, isWindowFocused, topWindow }
}
