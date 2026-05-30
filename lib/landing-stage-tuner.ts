import type { LandingStageLayoutKey, StageDeviceSlot } from '@/lib/landing-stage-scale'
import { resolveSlotPosition } from '@/lib/landing-stage-scale'

/** Env flag; readable during SSR. */
export function isLandingStageTunerFromEnv(): boolean {
	const flag = process.env.NEXT_PUBLIC_LANDING_STAGE_TUNER?.trim().toLowerCase()
	return flag === '1' || flag === 'true'
}

/** URL param; client-only. */
export function isLandingStageTunerFromUrl(): boolean {
	if (typeof window === 'undefined') return false
	return new URLSearchParams(window.location.search).get('landing_stage_tuner') === '1'
}

export function isLandingStageTuner(): boolean {
	return isLandingStageTunerFromEnv() || isLandingStageTunerFromUrl()
}

export function landingStageId(appSlug: string, variant: string): string {
	return `${appSlug}:${variant}`
}

function round(n: number, digits = 4) {
	return Number(n.toFixed(digits))
}

const MOCKUP_SPREAD: Record<StageDeviceSlot['id'], string> = {
	ipad: '...MOCKUP_IPAD',
	iphone: '...MOCKUP_IPHONE',
	'iphone-secondary': '...MOCKUP_IPHONE'
}

export type LandingStageTunerExportOptions = {
	manualClusterScale?: boolean
	scaleOverride?: number
	/** Inset from stage edges (px per side). */
	padding?: number
	/** Scale divisor; &gt;1 = smaller cluster. */
	fitMargin?: number
	maxScale?: number
}

export function formatLandingStageLayoutSnippet(
	layoutKey: LandingStageLayoutKey,
	slots: StageDeviceSlot[],
	opts?: LandingStageTunerExportOptions
): string {
	const deviceLines = slots
		.map((slot) => {
			const { x, y } = resolveSlotPosition(slot)
			const rotate = `rotate: ${Math.round(slot.rotate)}`
			const mult =
				slot.scaleMult != null && slot.scaleMult !== 1 ? `, scaleMult: ${round(slot.scaleMult, 3)}` : ''
			const z = slot.zIndex != null ? `, zIndex: ${slot.zIndex}` : ''
			return `\t\t{ id: '${slot.id}', x: ${Math.round(x)}, y: ${Math.round(y)}, ${rotate}${mult}${z}, ${MOCKUP_SPREAD[slot.id]} }`
		})
		.join(',\n')

	const lines = [
		`// Paste into LANDING_STAGE_LAYOUTS['${layoutKey}'] in lib/landing-stage-scale.config.ts`,
		'[',
		deviceLines,
		']'
	]

	if (opts) {
		const parts: string[] = []
		if (opts.padding !== undefined) parts.push(`padding: ${opts.padding}`)
		if (opts.fitMargin !== undefined) parts.push(`fitMargin: ${round(opts.fitMargin, 3)}`)
		if (opts.maxScale !== undefined) parts.push(`maxScale: ${opts.maxScale}`)

		if (parts.length > 0) {
			lines.push('', '// LANDING_STAGE_SCALE_OPTIONS', `{ ${parts.join(', ')} }`)
		}

		if (opts.manualClusterScale && opts.scaleOverride != null) {
			lines.push(
				'',
				`// Optional manual cluster scale: scaleOverride: ${round(opts.scaleOverride, 6)}`
			)
		}
	}

	return lines.join('\n')
}
