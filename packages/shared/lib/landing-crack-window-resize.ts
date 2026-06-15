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
import {
	clampPosition,
	getCrackWindowWorkArea,
	type PanelPosition,
	VIEWPORT_PAD,
	type WindowWorkArea
} from '@/lib/landing-crack-window-drag'

export type PanelSize = { width: number; height: number }

export const PANEL_MIN_WIDTH = 200
export const PANEL_MIN_HEIGHT = 120

export function getMaxPanelSize(workArea: WindowWorkArea | null = getCrackWindowWorkArea()): PanelSize {
	const pad = VIEWPORT_PAD * 2
	if (workArea) {
		return {
			width: Math.max(PANEL_MIN_WIDTH, workArea.right - workArea.left - pad),
			height: Math.max(PANEL_MIN_HEIGHT, workArea.bottom - workArea.top - pad)
		}
	}
	const vw = globalThis.innerWidth || 800
	const vh = globalThis.innerHeight || 600
	return {
		width: Math.max(PANEL_MIN_WIDTH, vw - pad),
		height: Math.max(PANEL_MIN_HEIGHT, vh - pad)
	}
}

export function clampSize(
	width: number,
	height: number,
	minWidth = PANEL_MIN_WIDTH,
	minHeight = PANEL_MIN_HEIGHT,
	workArea: WindowWorkArea | null = getCrackWindowWorkArea()
): PanelSize {
	const max = getMaxPanelSize(workArea)
	return {
		width: Math.min(max.width, Math.max(minWidth, Math.round(width))),
		height: Math.min(max.height, Math.max(minHeight, Math.round(height)))
	}
}

type ResizablePanelOptions = {
	disabled?: boolean
	panelRef: RefObject<HTMLDivElement | null>
	position: PanelPosition | null
	setPosition: (value: PanelPosition | null) => void
	minWidth?: number
	minHeight?: number
	onInteraction?: () => void
	onResizeEnd?: (size: PanelSize, meta: { resized: boolean }) => void
}

export type ResizablePanelResult = {
	size: PanelSize | null
	setSize: (value: PanelSize | null) => void
	hasSize: boolean
	sizeStyle: CSSProperties | undefined
	resizing: boolean
	handleProps: {
		onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void
		onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void
		onPointerUp: (e: ReactPointerEvent<HTMLElement>) => void
		onPointerCancel: (e: ReactPointerEvent<HTMLElement>) => void
		style: { touchAction: 'none'; cursor: string }
	}
}

export function ensureFloatingAtRect(
	panelRef: RefObject<HTMLDivElement | null>,
	position: PanelPosition | null,
	setPosition: (value: PanelPosition | null) => void,
	width: number,
	height: number
): void {
	if (position) return
	const panel = panelRef.current
	if (!panel) return
	const rect = panel.getBoundingClientRect()
	setPosition(clampPosition(rect.left, rect.top, width, height))
}

export function useResizablePanel(options: ResizablePanelOptions): ResizablePanelResult {
	const {
		disabled = false,
		panelRef,
		position,
		setPosition,
		minWidth = PANEL_MIN_WIDTH,
		minHeight = PANEL_MIN_HEIGHT,
		onInteraction,
		onResizeEnd
	} = options

	const [size, setSizeState] = useState<PanelSize | null>(null)
	const [resizing, setResizing] = useState(false)
	const sizeRef = useRef(size)
	sizeRef.current = size

	const setSize = useCallback((value: PanelSize | null) => {
		sizeRef.current = value
		setSizeState(value)
	}, [])

	const resizeRef = useRef<{
		pointerId: number
		startX: number
		startY: number
		origW: number
		origH: number
		resized: boolean
	} | null>(null)

	const sizeStyle: CSSProperties | undefined =
		size && !disabled ? { width: size.width, height: size.height, boxSizing: 'border-box' } : undefined

	useEffect(() => {
		if (!size) return

		const handler = () => {
			const panel = panelRef.current
			const current = sizeRef.current
			if (!current) return

			const nextSize = clampSize(current.width, current.height, minWidth, minHeight)
			if (nextSize.width !== current.width || nextSize.height !== current.height) {
				setSize(nextSize)
			}

			const pos = position
			if (pos && panel) {
				const nextPos = clampPosition(pos.x, pos.y, nextSize.width, nextSize.height)
				if (nextPos.x !== pos.x || nextPos.y !== pos.y) setPosition(nextPos)
			}
		}

		globalThis.addEventListener('resize', handler, { passive: true })
		return () => globalThis.removeEventListener('resize', handler)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [size != null, position?.x, position?.y, minWidth, minHeight, panelRef, setPosition, setSize])

	const onHandlePointerDown = useCallback(
		(e: ReactPointerEvent<HTMLElement>) => {
			if (disabled || e.button !== 0) return

			onInteraction?.()

			const panel = panelRef.current
			if (!panel) return

			const rect = panel.getBoundingClientRect()
			if (!position) {
				setPosition(clampPosition(rect.left, rect.top, rect.width, rect.height))
			}

			if (!sizeRef.current) {
				setSize(clampSize(rect.width, rect.height, minWidth, minHeight))
			}

			resizeRef.current = {
				pointerId: e.pointerId,
				startX: e.clientX,
				startY: e.clientY,
				origW: sizeRef.current?.width ?? rect.width,
				origH: sizeRef.current?.height ?? rect.height,
				resized: false
			}
			e.currentTarget.setPointerCapture(e.pointerId)
			setResizing(true)
			e.preventDefault()
			e.stopPropagation()
		},
		[disabled, minHeight, minWidth, onInteraction, panelRef, position, setPosition, setSize]
	)

	const onHandlePointerMove = useCallback(
		(e: ReactPointerEvent<HTMLElement>) => {
			const drag = resizeRef.current
			if (!drag || drag.pointerId !== e.pointerId) return

			const dx = e.clientX - drag.startX
			const dy = e.clientY - drag.startY
			if (dx !== 0 || dy !== 0) drag.resized = true
			const next = clampSize(drag.origW + dx, drag.origH + dy, minWidth, minHeight)
			setSize(next)

			const pos = position
			if (pos) {
				const nextPos = clampPosition(pos.x, pos.y, next.width, next.height)
				if (nextPos.x !== pos.x || nextPos.y !== pos.y) setPosition(nextPos)
			}
		},
		[minHeight, minWidth, position, setPosition, setSize]
	)

	const endResize = useCallback(
		(e: ReactPointerEvent<HTMLElement>) => {
			const drag = resizeRef.current
			if (!drag || drag.pointerId !== e.pointerId) return
			const resized = drag.resized
			const current = sizeRef.current
			resizeRef.current = null
			setResizing(false)
			e.currentTarget.releasePointerCapture(e.pointerId)
			if (current) onResizeEnd?.(current, { resized })
		},
		[onResizeEnd]
	)

	const handleProps = {
		onPointerDown: onHandlePointerDown,
		onPointerMove: onHandlePointerMove,
		onPointerUp: endResize,
		onPointerCancel: endResize,
		style: { touchAction: 'none' as const, cursor: disabled ? 'default' : 'nwse-resize' }
	}

	return {
		size,
		setSize,
		hasSize: size != null,
		sizeStyle,
		resizing,
		handleProps
	}
}
