import {
	clampPosition,
	getCrackWindowWorkArea,
	type PanelPosition,
	type WindowWorkArea
} from '@/lib/landing-crack-window-drag'
import type { CrackWindowId } from '@/lib/landing-crack-window-manager'
import type { PanelSize } from '@/lib/landing-crack-window-resize'

export type SavedWindowGeometry = {
	position: PanelPosition
	size: PanelSize | null
}

/** Fallback sizes before the panel has laid out (px). */
export const FLOATING_WINDOW_DEFAULT_SIZE: Partial<Record<CrackWindowId, PanelSize>> = {
	finder: { width: 352, height: 300 },
	preview: { width: 416, height: 360 },
	reader: { width: 384, height: 320 }
}

export function centerPanelPosition(
	width: number,
	height: number,
	workArea: WindowWorkArea | null = getCrackWindowWorkArea()
): PanelPosition {
	if (workArea) {
		const x = workArea.left + (workArea.right - workArea.left - width) / 2
		const y = workArea.top + (workArea.bottom - workArea.top - height) / 2
		return clampPosition(x, y, width, height, workArea)
	}
	const vw = globalThis.innerWidth || 800
	const vh = globalThis.innerHeight || 600
	return clampPosition((vw - width) / 2, (vh - height) / 2, width, height, null)
}

export function getDefaultFloatingSize(id: CrackWindowId, measured?: PanelSize | null): PanelSize {
	return measured ?? FLOATING_WINDOW_DEFAULT_SIZE[id] ?? { width: 352, height: 300 }
}
