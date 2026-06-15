'use client'

import {
	type CSSProperties,
	type PointerEvent as ReactPointerEvent,
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react'

export type PanelPosition = { x: number; y: number }

/** Matches `.landing-crack__workarea` — same bounds as the visible desktop. */
export const CRACK_WINDOW_WORKAREA_SELECTOR = '.landing-crack__workarea'

export type WindowWorkArea = {
	left: number
	top: number
	right: number
	bottom: number
}

export const VIEWPORT_PAD = 8

export function getCrackWindowWorkArea(): WindowWorkArea | null {
	if (typeof document === 'undefined') return null
	const el = document.querySelector(CRACK_WINDOW_WORKAREA_SELECTOR)
	if (!el) return null
	const rect = el.getBoundingClientRect()
	if (rect.width <= 0 || rect.height <= 0) return null
	return {
		left: rect.left,
		top: rect.top,
		right: rect.right,
		bottom: rect.bottom
	}
}

export function clampPosition(
	x: number,
	y: number,
	width: number,
	height: number,
	workArea: WindowWorkArea | null = getCrackWindowWorkArea()
): PanelPosition {
	const pad = VIEWPORT_PAD

	if (workArea) {
		const minX = workArea.left + pad
		const minY = workArea.top + pad
		const maxX = Math.max(minX, workArea.right - width - pad)
		const maxY = Math.max(minY, workArea.bottom - height - pad)
		return {
			x: Math.min(maxX, Math.max(minX, x)),
			y: Math.min(maxY, Math.max(minY, y))
		}
	}

	const vw = globalThis.innerWidth || 0
	const vh = globalThis.innerHeight || 0
	const maxX = Math.max(VIEWPORT_PAD, vw - width - VIEWPORT_PAD)
	const maxY = Math.max(VIEWPORT_PAD, vh - height - VIEWPORT_PAD)
	return {
		x: Math.min(maxX, Math.max(VIEWPORT_PAD, x)),
		y: Math.min(maxY, Math.max(VIEWPORT_PAD, y))
	}
}

function isInteractiveTarget(target: EventTarget | null): boolean {
	return Boolean((target as HTMLElement | null)?.closest('button, a, input, label, [role="slider"]'))
}

type DraggablePanelOptions = {
	onInteraction?: () => void
	onDragEnd?: (position: PanelPosition, meta: { moved: boolean }) => void
}

export type DraggablePanelResult = {
	panelRef: RefObject<HTMLDivElement | null>
	position: PanelPosition | null
	setPosition: (value: PanelPosition | null) => void
	dragging: boolean
	panelStyle: CSSProperties | undefined
	handleProps: {
		onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void
		onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void
		onPointerUp: (e: ReactPointerEvent<HTMLElement>) => void
		onPointerCancel: (e: ReactPointerEvent<HTMLElement>) => void
		style: { touchAction: 'none'; cursor: string }
	}
	isFloating: boolean
}

export function useDraggablePanel(disabled = false, options?: DraggablePanelOptions): DraggablePanelResult {
	const panelRef = useRef<HTMLDivElement>(null)
	const [position, setPositionState] = useState<PanelPosition | null>(null)
	const [dragging, setDragging] = useState(false)

	// Stable ref so onHandlePointerDown doesn't close over stale position state.
	const positionRef = useRef(position)
	positionRef.current = position

	const setPosition = useCallback((value: PanelPosition | null) => {
		positionRef.current = value
		setPositionState(value)
	}, [])

	const dragRef = useRef<{
		pointerId: number
		startX: number
		startY: number
		origX: number
		origY: number
		moved: boolean
	} | null>(null)

	const panelStyle: CSSProperties | undefined =
		position && !disabled
			? {
					position: 'fixed',
					left: position.x,
					top: position.y,
					margin: 0
				}
			: undefined

	// Reclamp position when the viewport is resized (only while floating).
	useEffect(() => {
		if (!position) return

		const handler = () => {
			const panel = panelRef.current
			const pos = positionRef.current
			if (!pos || !panel) return
			const next = clampPosition(pos.x, pos.y, panel.offsetWidth, panel.offsetHeight)
			if (next.x !== pos.x || next.y !== pos.y) setPosition(next)
		}

		globalThis.addEventListener('resize', handler, { passive: true })
		return () => globalThis.removeEventListener('resize', handler)
		// Depend only on whether we're floating, not on the position value itself.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [position != null])

	const onHandlePointerDown = useCallback(
		(e: ReactPointerEvent<HTMLElement>) => {
			if (disabled || e.button !== 0 || isInteractiveTarget(e.target)) return

			options?.onInteraction?.()

			const panel = panelRef.current
			if (!panel) return

			const rect = panel.getBoundingClientRect()
			if (!positionRef.current) {
				setPosition(clampPosition(rect.left, rect.top, rect.width, rect.height))
			}

			dragRef.current = {
				pointerId: e.pointerId,
				startX: e.clientX,
				startY: e.clientY,
				origX: positionRef.current!.x,
				origY: positionRef.current!.y,
				moved: false
			}
			e.currentTarget.setPointerCapture(e.pointerId)
			setDragging(true)
			e.preventDefault()
		},
		// `options` identity must be stable (passed as a literal — memo it at the call site if needed).
		// `disabled` correctly gates the callback.
		[disabled, options]
	)

	const onHandlePointerMove = useCallback((e: ReactPointerEvent<HTMLElement>) => {
		const drag = dragRef.current
		const panel = panelRef.current
		if (!drag || drag.pointerId !== e.pointerId || !panel) return

		const dx = e.clientX - drag.startX
		const dy = e.clientY - drag.startY
		if (dx !== 0 || dy !== 0) drag.moved = true
		const next = clampPosition(drag.origX + dx, drag.origY + dy, panel.offsetWidth, panel.offsetHeight)
		setPosition(next)
	}, [])

	const endDrag = useCallback(
		(e: ReactPointerEvent<HTMLElement>) => {
			const drag = dragRef.current
			if (!drag || drag.pointerId !== e.pointerId) return
			const moved = drag.moved
			const pos = positionRef.current
			dragRef.current = null
			setDragging(false)
			e.currentTarget.releasePointerCapture(e.pointerId)
			if (pos) options?.onDragEnd?.(pos, { moved })
		},
		[options]
	)

	const handleProps = {
		onPointerDown: onHandlePointerDown,
		onPointerMove: onHandlePointerMove,
		onPointerUp: endDrag,
		onPointerCancel: endDrag,
		style: { touchAction: 'none' as const, cursor: disabled ? 'default' : dragging ? 'grabbing' : 'grab' }
	}

	return {
		panelRef,
		position,
		setPosition,
		dragging,
		panelStyle,
		handleProps,
		isFloating: position != null && !disabled
	}
}
