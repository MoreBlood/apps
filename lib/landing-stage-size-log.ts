/** Enable with `?landing_stage_size_log=1` or NEXT_PUBLIC_LANDING_STAGE_SIZE_LOG=1 */

export function isLandingStageSizeLog(): boolean {
	if (typeof window !== 'undefined') {
		if (new URLSearchParams(window.location.search).get('landing_stage_size_log') === '1') {
			return true
		}
	}
	const flag = process.env.NEXT_PUBLIC_LANDING_STAGE_SIZE_LOG?.trim().toLowerCase()
	return flag === '1' || flag === 'true'
}

type BoxMetrics = {
	w: number
	h: number
	top: number
	aspectRatio: string
	minHeight: string
	height: string
	display: string
}

function measureBox(el: HTMLElement | null): BoxMetrics | null {
	if (!el) return null
	const r = el.getBoundingClientRect()
	const s = getComputedStyle(el)
	const round = (n: number) => Math.round(n * 10) / 10
	return {
		w: round(r.width),
		h: round(r.height),
		top: round(r.top),
		aspectRatio: s.aspectRatio,
		minHeight: s.minHeight,
		height: s.height,
		display: s.display
	}
}

function fmtBox(label: string, box: BoxMetrics | null): string {
	if (!box) return `${label}=null`
	return `${label}=${box.w}x${box.h}px top=${box.top} ar=${box.aspectRatio} minH=${box.minHeight} h=${box.height}`
}

let seq = 0
const lines: string[] = []
let tipPrinted = false

export type LandingStageSizeLogPayload = {
	reason: string
	variant: string
	stageId?: string
	layoutKey?: string
	clusterScale?: number
	firstReady?: boolean
	prevSlotH?: number
	deltaSlotH?: number
}

function formatLine(
	n: number,
	t: string,
	payload: LandingStageSizeLogPayload,
	ready: boolean,
	slot: BoxMetrics | null,
	stage: BoxMetrics | null,
	inner: BoxMetrics | null
): string {
	const parts = [
		`#${n}`,
		`t=${t}`,
		`reason=${payload.reason}`,
		`variant=${payload.variant}`,
		payload.stageId ? `stageId=${payload.stageId}` : '',
		payload.layoutKey ? `layout=${payload.layoutKey}` : '',
		payload.clusterScale != null ? `scale=${payload.clusterScale.toFixed(4)}` : '',
		`ready=${ready}`,
		payload.firstReady ? 'firstReady=true' : '',
		payload.deltaSlotH != null ? `deltaSlotH=${payload.deltaSlotH.toFixed(1)}` : '',
		payload.prevSlotH != null ? `prevSlotH=${payload.prevSlotH.toFixed(1)}` : '',
		fmtBox('slot', slot),
		fmtBox('stage', stage),
		fmtBox('inner', inner)
	].filter(Boolean)

	return `[landing-stage-size] ${parts.join(' | ')}`
}

declare global {
	interface Window {
		copyLandingStageSizeLogs?: () => Promise<void>
		__landingStageSizeLogs?: string[]
	}
}

function registerCopyHelper() {
	if (typeof window === 'undefined') return
	if (window.copyLandingStageSizeLogs) return

	window.__landingStageSizeLogs = lines
	window.copyLandingStageSizeLogs = async () => {
		const text = lines.join('\n')
		await navigator.clipboard.writeText(text)
		console.log(`[landing-stage-size] copied ${lines.length} lines to clipboard`)
	}
}

export function logLandingStageSize(stageEl: HTMLElement, payload: LandingStageSizeLogPayload) {
	if (!isLandingStageSizeLog()) return

	const showcase = stageEl.closest('.landing-hero__showcase')
	const featureSlot = stageEl.closest('.landing-feature__visual')
	const slot = (showcase ?? featureSlot) as HTMLElement | null

	const line = formatLine(
		++seq,
		`${performance.now().toFixed(0)}ms`,
		payload,
		stageEl.classList.contains('landing-stage--ready'),
		measureBox(slot),
		measureBox(stageEl),
		measureBox(stageEl.parentElement)
	)

	lines.push(line)
	console.log(line)

	if (!tipPrinted) {
		tipPrinted = true
		registerCopyHelper()
		console.log('[landing-stage-size] copy: run copyLandingStageSizeLogs() in console, or filter logs and select lines')
	}
}

export function getLandingStageSizeLogText(): string {
	return lines.join('\n')
}
