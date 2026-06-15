'use client'

import type { CSSProperties } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { getCrackWindowDef } from '@/config/landing-crack-windows'
import { clampPosition, type PanelPosition, useDraggablePanel } from '@/lib/landing-crack-window-drag'
import {
	centerPanelPosition,
	getDefaultFloatingSize,
	type SavedWindowGeometry
} from '@/lib/landing-crack-window-geometry'
import type { CrackWindowId, WindowChromeState } from '@/lib/landing-crack-window-manager'
import type { PanelSize } from '@/lib/landing-crack-window-resize'
import { ensureFloatingAtRect, useResizablePanel } from '@/lib/landing-crack-window-resize'
import { useLandingCrackFinder } from './LandingCrackFinderContext'
import { useLandingCrackShell } from './LandingCrackShellContext'

type Options = {
	/** When true, titlebar drag is disabled (e.g. maximized). */
	dragDisabled?: boolean
}

const PLACEMENT_WINDOW_IDS = new Set<CrackWindowId>(['finder', 'preview', 'reader'])

function readPanelSize(panel: HTMLDivElement | null, explicit: PanelSize | null, id: CrackWindowId): PanelSize {
	if (explicit) return explicit
	if (panel) return { width: panel.offsetWidth, height: panel.offsetHeight }
	return getDefaultFloatingSize(id)
}

/** Binds a crack window to the shared manager: focus, z-index, chrome, drag, resize. */
export function useCrackWindow(id: CrackWindowId, options: Options = {}) {
	const wm = useLandingCrackShell()
	const finderNav = useLandingCrackFinder()
	const def = getCrackWindowDef(id)
	const chrome = wm.getChrome(id)
	const visible = wm.isVisible(id)
	const dragDisabled = options.dragDisabled ?? (chrome === 'minimized' || chrome === 'closed')
	const resizeDisabled = !def.supportsResize || dragDisabled || chrome === 'maximized'
	const prevChromeRef = useRef(chrome)

	const dragRef = useRef<ReturnType<typeof useDraggablePanel> | null>(null)
	const resizeRef = useRef<ReturnType<typeof useResizablePanel> | null>(null)

	const persistGeometry = useCallback(
		(position?: PanelPosition | null, size?: PanelSize | null) => {
			const dragApi = dragRef.current
			const resizeApi = resizeRef.current
			const panel = dragApi?.panelRef.current
			const resolvedPosition = position ?? dragApi?.position ?? null
			if (!resolvedPosition || !panel) return

			const geometry: SavedWindowGeometry = {
				position: resolvedPosition,
				size: size ?? readPanelSize(panel, resizeApi?.size ?? null, id)
			}
			wm.saveWindowGeometry(id, geometry)
		},
		[id, wm]
	)

	const drag = useDraggablePanel(dragDisabled || !visible, {
		onInteraction: () => wm.activate(id),
		onDragEnd: (position, { moved }) => {
			if (moved) persistGeometry(position)
		}
	})
	dragRef.current = drag

	const resize = useResizablePanel({
		disabled: resizeDisabled || !visible,
		panelRef: drag.panelRef,
		position: drag.position,
		setPosition: drag.setPosition,
		onInteraction: () => wm.activate(id),
		onResizeEnd: (size, { resized }) => {
			if (!resized) return
			const panel = drag.panelRef.current
			let pos = drag.position
			if (!pos && panel) {
				const rect = panel.getBoundingClientRect()
				pos = clampPosition(rect.left, rect.top, size.width, size.height)
				drag.setPosition(pos)
			}
			persistGeometry(pos, size)
		}
	})
	resizeRef.current = resize

	const zIndex = wm.getZIndex(id, drag.dragging || resize.resizing)

	const anchorsInDesktopFlow = id === 'main' && chrome !== 'maximized' && !drag.panelStyle

	const panelStyle: CSSProperties = {
		...(chrome === 'maximized' ? {} : { ...drag.panelStyle, ...resize.sizeStyle }),
		zIndex,
		...(anchorsInDesktopFlow ? { position: 'relative' } : {})
	}

	const applyCenteredPlacement = useCallback(
		(width: number, height: number) => {
			drag.setPosition(centerPanelPosition(width, height))
		},
		[drag]
	)

	const restoreSavedGeometry = useCallback(() => {
		const saved = wm.getWindowGeometry(id)
		if (!saved) return false

		drag.setPosition(saved.position)
		if (saved.size) resize.setSize(saved.size)
		return true
	}, [drag, id, resize, wm])

	const centerFromPanel = useCallback(() => {
		const panel = drag.panelRef.current
		const size = readPanelSize(panel, resize.size, id)
		if (resize.size == null && def.supportsResize) resize.setSize(size)
		applyCenteredPlacement(size.width, size.height)
	}, [applyCenteredPlacement, def.supportsResize, drag, id, resize])

	// Apply pre-seeded or saved geometry when the panel has no floating position yet.
	useEffect(() => {
		if (!visible || chrome !== 'normal' || !PLACEMENT_WINDOW_IDS.has(id)) return
		if (drag.position) return

		const saved = wm.getWindowGeometry(id)
		if (saved) {
			requestAnimationFrame(() => restoreSavedGeometry())
		}
	}, [chrome, drag.position, id, restoreSavedGeometry, visible, wm])

	useEffect(() => {
		const prev = prevChromeRef.current
		prevChromeRef.current = chrome

		if (!visible || chrome === 'minimized' || chrome === 'maximized') return
		if (!PLACEMENT_WINDOW_IDS.has(id)) return

		const openedFromClosed = prev === 'closed' && chrome === 'normal'
		if (!openedFromClosed) return

		if (wm.isWindowGeometryCustomized(id)) {
			requestAnimationFrame(() => restoreSavedGeometry())
			return
		}

		if (wm.getWindowGeometry(id)) return

		if (id === 'preview') return

		requestAnimationFrame(() => centerFromPanel())
	}, [centerFromPanel, chrome, id, restoreSavedGeometry, visible, wm])

	return {
		id,
		wm,
		drag,
		resize,
		chrome,
		zIndex,
		panelStyle,
		hasPanelSize: resize.hasSize,
		focused: wm.isFocused(id),
		visible,
		running: wm.isRunning(id),
		active: wm.isActive(id),
		isMaximized: chrome === 'maximized',
		isMinimized: chrome === 'minimized',
		supportsResize: def.supportsResize,
		activate: () => wm.activate(id),
		setChrome: (next: WindowChromeState) => wm.setChrome(id, next),
		toggleMaximize: () => wm.toggleMaximize(id),
		setPanelSize: resize.setSize,
		applyCenteredPlacement,
		isGeometryCustomized: () => wm.isWindowGeometryCustomized(id),
		ensureFloatingAtCurrentRect: (width: number, height: number) =>
			ensureFloatingAtRect(drag.panelRef, drag.position, drag.setPosition, width, height),
		close: () => {
			if (id === 'preview') {
				finderNav.closePhoto()
				return
			}
			if (id === 'reader') {
				finderNav.closeReader()
				return
			}
			wm.setChrome(id, 'closed')
		},
		minimize: () => wm.setChrome(id, 'minimized')
	}
}

export function unmaximizeFromTitlebarDrag(
	id: CrackWindowId,
	e: React.PointerEvent<HTMLElement>,
	wm: ReturnType<typeof useLandingCrackShell>,
	drag: ReturnType<typeof useDraggablePanel>
): boolean {
	if (wm.getChrome(id) !== 'maximized') return false

	const panel = drag.panelRef.current
	if (panel) {
		const rect = panel.getBoundingClientRect()
		const pos = clampPosition(e.clientX - rect.width * 0.35, e.clientY - 14, rect.width, rect.height)
		drag.setPosition(pos)
		wm.saveWindowGeometry(id, {
			position: pos,
			size: { width: rect.width, height: rect.height }
		})
	}
	wm.setChrome(id, 'normal')
	return true
}
