import { clampSize, getMaxPanelSize, type PanelSize } from '@/lib/landing-crack-window-resize'

/** Titlebar, tabs, caption, actions, and inner padding (px). */
const PREVIEW_CHROME_V = 118
const PREVIEW_CHROME_H = 14

export type PreviewLayout = {
	window: PanelSize
	image: PanelSize
}

export function computePreviewLayout(naturalWidth: number, naturalHeight: number): PreviewLayout {
	const maxWindow = getMaxPanelSize()
	const maxImgW = Math.max(120, maxWindow.width - PREVIEW_CHROME_H)
	const maxImgH = Math.max(80, maxWindow.height - PREVIEW_CHROME_V)

	const scale = Math.min(1, maxImgW / naturalWidth, maxImgH / naturalHeight)
	const image = {
		width: Math.max(1, Math.round(naturalWidth * scale)),
		height: Math.max(1, Math.round(naturalHeight * scale))
	}

	const window = clampSize(image.width + PREVIEW_CHROME_H, image.height + PREVIEW_CHROME_V)

	return { window, image }
}
