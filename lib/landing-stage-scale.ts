import { DEFAULT_STAGE_DEVICE_Z, STAGE_ARTBOARD } from '@/lib/landing-stage-scale.config'

export {
	cloneLandingStageSlots,
	DEFAULT_STAGE_DEVICE_Z,
	getFeatureStageLayoutKey,
	getLandingStageDevices,
	getLandingStageLayoutKey,
	LANDING_STAGE_FEATURE_COMPOSITION_OPTIONS,
	LANDING_STAGE_FEATURE_COMPOSITION_REF_PX,
	LANDING_STAGE_FEATURE_SCALE_OPTIONS,
	LANDING_STAGE_FEATURE_TO_HERO_RATIO,
	LANDING_STAGE_HERO_SCALE_OPTIONS,
	LANDING_STAGE_LAYOUTS,
	LANDING_STAGE_SCALE_OPTIONS,
	STAGE_ARTBOARD
} from '@/lib/landing-stage-scale.config'
export type {
	ComputeStageScaleOptions,
	LandingStageLayoutKey,
	LandingStageLayoutOptions,
	LandingStageScaleResult,
	PlacedStageDevice,
	StageAnchoredDevice,
	StageDeviceId,
	StageDeviceSlot
} from '@/lib/landing-stage-scale.types'

import type {
	ComputeStageScaleOptions,
	LandingStageScaleResult,
	PlacedStageDevice,
	StageAnchoredDevice,
	StageDeviceSlot
} from '@/lib/landing-stage-scale.types'

function nativeSize(device: StageAnchoredDevice) {
	const mult = device.scaleMult ?? 1
	return { w: device.w * mult, h: device.h * mult }
}

/** Resolve slot anchor to artboard px (center-relative). */
export function resolveSlotPosition(device: StageAnchoredDevice): { x: number; y: number } {
	if (device.x != null || device.y != null) {
		return {
			x:
				device.x ??
				(device.left != null
					? device.left * STAGE_ARTBOARD.w
					: device.right != null
						? -device.right * STAGE_ARTBOARD.w
						: 0),
			y: device.y ?? (device.top != null ? device.top * STAGE_ARTBOARD.h : 0)
		}
	}
	const x =
		device.left != null ? device.left * STAGE_ARTBOARD.w : device.right != null ? -device.right * STAGE_ARTBOARD.w : 0
	const y = device.top != null ? device.top * STAGE_ARTBOARD.h : 0
	return { x, y }
}

/** @deprecated Use `resolveSlotPosition`. Fraction of artboard width for tuner export compat. */
export function stageOffsetXFraction(device: StageAnchoredDevice): number {
	return resolveSlotPosition(device).x / STAGE_ARTBOARD.w
}

export function getStageDeviceZIndex(slot: Pick<StageDeviceSlot, 'id' | 'zIndex'>) {
	return slot.zIndex ?? DEFAULT_STAGE_DEVICE_Z[slot.id]
}

/** Device bounds in artboard space; anchor is device center. */
export function deviceRectArtboard(device: StageAnchoredDevice) {
	const { x: ox, y: oy } = resolveSlotPosition(device)
	const { w: nw, h: nh } = nativeSize(device)
	const cx = ox
	const cy = oy
	const x = cx - nw / 2
	const y = cy - nh / 2
	return { x, y, w: nw, h: nh, cx, cy, x2: x + nw, y2: y + nh }
}

/** @deprecated Use `deviceRectArtboard`. */
export function deviceRect(_containerW: number, _containerH: number, device: StageAnchoredDevice, _layoutScale = 1) {
	const rect = deviceRectArtboard(device)
	if (_layoutScale === 1) return rect
	return {
		...rect,
		w: rect.w * _layoutScale,
		h: rect.h * _layoutScale,
		x: rect.cx - (rect.w * _layoutScale) / 2,
		y: rect.cy - (rect.h * _layoutScale) / 2,
		x2: rect.cx + (rect.w * _layoutScale) / 2,
		y2: rect.cy + (rect.h * _layoutScale) / 2
	}
}

function rotatedBoundsAroundCenter(w: number, h: number, rotateDeg: number) {
	const rad = (Math.abs(rotateDeg) * Math.PI) / 180
	return {
		w: Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad)),
		h: Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad))
	}
}

function layoutCompositionBounds(slots: StageDeviceSlot[], shadowPad: number) {
	let minX = Number.POSITIVE_INFINITY
	let minY = Number.POSITIVE_INFINITY
	let maxX = Number.NEGATIVE_INFINITY
	let maxY = Number.NEGATIVE_INFINITY

	for (const slot of slots) {
		const rect = deviceRectArtboard(slot)
		const bound = rotatedBoundsAroundCenter(rect.w, rect.h, slot.rotate)
		const x0 = rect.cx - bound.w / 2 - shadowPad
		const y0 = rect.cy - bound.h / 2 - shadowPad
		const x1 = rect.cx + bound.w / 2 + shadowPad
		const y1 = rect.cy + bound.h / 2 + shadowPad
		minX = Math.min(minX, x0)
		minY = Math.min(minY, y0)
		maxX = Math.max(maxX, x1)
		maxY = Math.max(maxY, y1)
	}

	return {
		minX,
		minY,
		maxX,
		maxY,
		compositionW: maxX - minX,
		compositionH: maxY - minY
	}
}

function round4(n: number) {
	return Number(n.toFixed(4))
}

const CLUSTER_SCALE_STEP = 0.01

export function clusterPixelSnapScore(
	scale: number,
	compositionW: number,
	compositionH: number,
	containerW: number,
	containerH: number
): number {
	const scaledW = compositionW * scale
	const scaledH = compositionH * scale
	const offsetX = (containerW - scaledW) / 2
	const offsetY = (containerH - scaledH) / 2
	return (
		Math.abs(scaledW - Math.round(scaledW)) +
		Math.abs(scaledH - Math.round(scaledH)) +
		Math.abs(offsetX - Math.round(offsetX)) +
		Math.abs(offsetY - Math.round(offsetY))
	)
}

export function snapClusterScale(
	scale: number,
	compositionW: number,
	compositionH: number,
	containerW: number,
	containerH: number,
	minScale: number,
	maxScale: number,
	maxNudge = 0.03
): number {
	const base = Math.round(scale / CLUSTER_SCALE_STEP) * CLUSTER_SCALE_STEP
	let best = Math.min(maxScale, Math.max(minScale, base))
	let bestScore = clusterPixelSnapScore(best, compositionW, compositionH, containerW, containerH)
	let bestDist = Math.abs(best - scale)

	const steps = Math.ceil(maxNudge / CLUSTER_SCALE_STEP)
	for (let i = -steps; i <= steps; i++) {
		const candidate = Math.min(maxScale, Math.max(minScale, base + i * CLUSTER_SCALE_STEP))
		const score = clusterPixelSnapScore(candidate, compositionW, compositionH, containerW, containerH)
		const dist = Math.abs(candidate - scale)
		if (score < bestScore - 1e-6 || (Math.abs(score - bestScore) < 1e-6 && dist < bestDist)) {
			best = candidate
			bestScore = score
			bestDist = dist
		}
	}

	return Number(best.toFixed(4))
}

export function computeLandingStageScaleResult(
	containerW: number,
	containerH: number,
	slots: StageDeviceSlot[],
	options: ComputeStageScaleOptions = {}
): LandingStageScaleResult {
	const padding = (options.padding ?? 12) + (options.filterBleed ?? 0)
	const shadowPad = options.shadowPad ?? 24
	const fitMargin = options.fitMargin ?? 1.06
	const clusterScaleMult = options.clusterScaleMult ?? 1
	const inset = padding
	const minScale = options.minScale ?? 0.05
	const maxScale = options.maxScale ?? 1
	const layoutKey = options.layoutKey ?? 'default'
	const label = options.debugLabel ?? `landing-stage:${layoutKey}`

	if (containerW <= 0 || containerH <= 0 || slots.length === 0) {
		return {
			scale: minScale,
			layoutKey,
			label,
			container: { w: Math.round(containerW), h: Math.round(containerH) },
			raw: minScale,
			padding,
			minScale,
			maxScale,
			composition: { w: 0, h: 0 },
			placed: [],
			bbox: null,
			constraints: []
		}
	}

	const layoutBounds = layoutCompositionBounds(slots, shadowPad)
	const { minX, minY, compositionW, compositionH } = layoutBounds

	const scaleW = (containerW - inset * 2) / compositionW
	const scaleH = (containerH - inset * 2) / compositionH
	const constraints = [
		{ label: 'fit composition width', scale: scaleW },
		{ label: 'fit composition height', scale: scaleH }
	]
	const raw = Math.min(scaleW, scaleH) / fitMargin
	const autoScale = Math.min(maxScale, Math.max(minScale, raw))
	const unclamped =
		options.scaleOverride != null ? Math.min(maxScale, Math.max(minScale, options.scaleOverride)) : autoScale
	const snapped = snapClusterScale(unclamped, compositionW, compositionH, containerW, containerH, minScale, maxScale)
	const maxFit = Math.min(scaleW, scaleH)
	const baseFit = Math.min(snapped, maxFit)
	const scale = Number(Math.min(baseFit * clusterScaleMult, maxFit).toFixed(4))

	const placed: PlacedStageDevice[] = slots.map((slot) => {
		const rect = deviceRectArtboard(slot)
		return {
			id: slot.id,
			x: Math.round(rect.cx - minX),
			y: Math.round(rect.cy - minY),
			w: slot.w,
			h: slot.h,
			rotate: Math.round(slot.rotate),
			scaleMult: slot.scaleMult ?? 1,
			zIndex: getStageDeviceZIndex(slot)
		}
	})

	const scaledW = compositionW * scale
	const scaledH = compositionH * scale
	const offsetX = (containerW - scaledW) / 2
	const offsetY = (containerH - scaledH) / 2

	return {
		scale,
		layoutKey,
		label,
		container: { w: Math.round(containerW), h: Math.round(containerH) },
		raw: round4(raw),
		padding,
		minScale,
		maxScale,
		composition: { w: Math.round(compositionW), h: Math.round(compositionH) },
		placed,
		bbox: {
			minX: Math.round(offsetX),
			minY: Math.round(offsetY),
			maxX: Math.round(offsetX + scaledW),
			maxY: Math.round(offsetY + scaledH)
		},
		constraints: constraints.sort((a, b) => a.scale - b.scale).map((c) => ({ label: c.label, scale: round4(c.scale) }))
	}
}

export function applyLandingStageComposition(el: HTMLElement, result: LandingStageScaleResult) {
	el.style.setProperty('--composition-w', `${result.composition.w}px`)
	el.style.setProperty('--composition-h', `${result.composition.h}px`)

	for (const device of result.placed) {
		const prefix = `--device-${device.id}`
		el.style.setProperty(`${prefix}-x`, `${device.x}px`)
		el.style.setProperty(`${prefix}-y`, `${device.y}px`)
		el.style.setProperty(`${prefix}-rotate`, `${device.rotate}deg`)
		el.style.setProperty(`${prefix}-mult`, String(device.scaleMult))
		el.style.setProperty(`${prefix}-z`, String(device.zIndex))
	}
}

export function applyLandingStageLayout(el: HTMLElement, result: LandingStageScaleResult) {
	applyLandingStageComposition(el, result)
	el.style.setProperty('--cluster-scale', result.scale.toFixed(4))
}

/** Hero publishes live cluster scale (feature rows measure their own visual slot). */
export function publishLandingHeroClusterScale(scale: number) {
	document.documentElement.style.setProperty('--landing-hero-cluster-scale', scale.toFixed(4))
}

export function computeLandingStageScale(
	containerW: number,
	containerH: number,
	slots: StageDeviceSlot[],
	options: ComputeStageScaleOptions = {}
): number {
	return computeLandingStageScaleResult(containerW, containerH, slots, options).scale
}

export function formatLandingStageScaleReport(result: LandingStageScaleResult): string {
	const lines = [
		'=== landing-stage scale debug ===',
		`label: ${result.label}`,
		`layout: ${result.layoutKey}`,
		`artboard: ${STAGE_ARTBOARD.w} x ${STAGE_ARTBOARD.h} px`,
		`container: ${result.container.w} x ${result.container.h} px`,
		`composition: ${result.composition.w} x ${result.composition.h} px`,
		`padding: ${result.padding} px`,
		`cluster-scale: ${round4(result.scale)} (raw ${result.raw}, clamp ${result.minScale}–${result.maxScale})`,
		''
	]

	if (result.placed.length > 0) {
		lines.push('devices (px from composition top-left to center):')
		for (const d of result.placed) {
			lines.push(`  ${d.id}: x=${d.x}px y=${d.y}px ${d.w}x${d.h} rotate=${d.rotate} mult=${d.scaleMult} z=${d.zIndex}`)
		}
		lines.push('')
	}

	if (result.bbox) {
		lines.push(
			'scaled cluster bbox in container:',
			`  x: ${result.bbox.minX} … ${result.bbox.maxX} (span ${result.bbox.maxX - result.bbox.minX})`,
			`  y: ${result.bbox.minY} … ${result.bbox.maxY} (span ${result.bbox.maxY - result.bbox.minY})`,
			''
		)
	}

	if (result.constraints.length > 0) {
		lines.push('constraints (tightest first):')
		for (const c of result.constraints) {
			const marker = c.scale === round4(result.raw) ? '  ← limits scale' : ''
			lines.push(`  ${c.scale}\t${c.label}${marker}`)
		}
	}

	lines.push('', '=== end ===')
	return lines.join('\n')
}
