export type DesktopIconPosition = {
	left: string
	top: string
}

const DRAG_CLICK_THRESHOLD_PX = 6

export function parseCssPercent(value: string, axisSize: number): number {
	const trimmed = value.trim()
	if (trimmed.endsWith('%')) {
		return (Number.parseFloat(trimmed) / 100) * axisSize
	}
	return Number.parseFloat(trimmed) || 0
}

export function toCssPercent(px: number, axisSize: number): string {
	if (axisSize <= 0) return '0%'
	const pct = (px / axisSize) * 100
	return `${Math.round(Math.min(100, Math.max(0, pct)) * 10) / 10}%`
}

export function initialDesktopPositions(
	icons: { id: string; left: string; top: string }[]
): Record<string, DesktopIconPosition> {
	return Object.fromEntries(icons.map((icon) => [icon.id, { left: icon.left, top: icon.top }]))
}

export function isDesktopIconClick(dragDistancePx: number): boolean {
	return dragDistancePx < DRAG_CLICK_THRESHOLD_PX
}
