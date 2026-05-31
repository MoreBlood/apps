'use client'

import {
	type CSSProperties,
	type PointerEvent as ReactPointerEvent,
	type RefObject,
	useCallback,
	useRef,
	useState
} from 'react'

export type PanelPosition = { x: number; y: number }

const VIEWPORT_PAD = 8

export function clampPosition(x: number, y: number, width: number, height: number): PanelPosition {
	const maxX = Math.max(VIEWPORT_PAD, globalThis.innerWidth - width - VIEWPORT_PAD)
	const maxY = Math.max(VIEWPORT_PAD, globalThis.innerHeight - height - VIEWPORT_PAD)
	return {
		x: Math.min(maxX, Math.max(VIEWPORT_PAD, x)),
		y: Math.min(maxY, Math.max(VIEWPORT_PAD, y))
	}
}

function isInteractiveTarget(target: EventTarget | null): boolean {
	return Boolean((target as HTMLElement | null)?.closest('button, a, input, label, [role="slider"]'))
}

type DraggablePanelOptions = {
	zIndex?: number
	zIndexDragging?: number
	onInteraction?: () => void
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
	const [position, setPosition] = useState<PanelPosition | null>(null)
	const [dragging, setDragging] = useState(false)
	const dragRef = useRef<{
		pointerId: number
		startX: number
		startY: number
		origX: number
		origY: number
	} | null>(null)

	const baseZ = options?.zIndex ?? 3
	const dragZ = options?.zIndexDragging ?? baseZ + 48

	const panelStyle: CSSProperties | undefined =
		position && !disabled
			? {
					position: 'fixed',
					left: position.x,
					top: position.y,
					margin: 0,
					zIndex: dragging ? dragZ : baseZ
				}
			: undefined

	const onHandlePointerDown = useCallback(
		(e: ReactPointerEvent<HTMLElement>) => {
			if (disabled || e.button !== 0 || isInteractiveTarget(e.target)) return

			options?.onInteraction?.()

			const panel = panelRef.current
			if (!panel) return

			const rect = panel.getBoundingClientRect()
			const origX = position?.x ?? rect.left
			const origY = position?.y ?? rect.top
			if (!position) setPosition({ x: origX, y: origY })

			dragRef.current = {
				pointerId: e.pointerId,
				startX: e.clientX,
				startY: e.clientY,
				origX,
				origY
			}
			e.currentTarget.setPointerCapture(e.pointerId)
			setDragging(true)
			e.preventDefault()
		},
		[disabled, options, position]
	)

	const onHandlePointerMove = useCallback((e: ReactPointerEvent<HTMLElement>) => {
		const drag = dragRef.current
		const panel = panelRef.current
		if (!drag || drag.pointerId !== e.pointerId || !panel) return

		const dx = e.clientX - drag.startX
		const dy = e.clientY - drag.startY
		const next = clampPosition(drag.origX + dx, drag.origY + dy, panel.offsetWidth, panel.offsetHeight)
		setPosition(next)
	}, [])

	const endDrag = useCallback((e: ReactPointerEvent<HTMLElement>) => {
		const drag = dragRef.current
		if (!drag || drag.pointerId !== e.pointerId) return
		dragRef.current = null
		setDragging(false)
		e.currentTarget.releasePointerCapture(e.pointerId)
	}, [])

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
