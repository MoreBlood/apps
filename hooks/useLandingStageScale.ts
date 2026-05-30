'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { useLandingStageTunerOptional } from '@/components/landing/LandingStageTunerContext'
import { isLandingStageDebug } from '@/lib/landing-stage-debug'
import {
	applyLandingStageLayout,
	computeLandingStageScaleResult,
	formatLandingStageScaleReport,
	getLandingStageDevices,
	getLandingStageLayoutKey,
	LANDING_STAGE_FEATURE_SCALE_OPTIONS,
	LANDING_STAGE_HERO_SCALE_OPTIONS
} from '@/lib/landing-stage-scale'
import { isLandingStageSizeLog, logLandingStageSize } from '@/lib/landing-stage-size-log'

type Variant = 'hero' | 'compact' | string

type Options = {
	stageId?: string
	featureIndex?: number
}

/** Positions mockups inside a fixed-size stage box (CSS owns outer dimensions). */
export function useLandingStageScale(variant: Variant = 'hero', options: Options = {}) {
	const stageRef = useRef<HTMLDivElement>(null)
	const [debugReport, setDebugReport] = useState<string | null>(null)
	const tuner = useLandingStageTunerOptional()
	const { stageId, featureIndex } = options
	const overrideRevision = tuner?.overrideRevision ?? 0
	const tunerRef = useRef(tuner)
	tunerRef.current = tuner
	const readyRef = useRef(false)
	const lastSlotHeightRef = useRef<number | undefined>(undefined)
	const sizeLogRef = useRef(isLandingStageSizeLog())

	useLayoutEffect(() => {
		readyRef.current = false
		lastSlotHeightRef.current = undefined
		stageRef.current?.classList.remove('landing-stage--ready')
	}, [variant, stageId, featureIndex])

	useLayoutEffect(() => {
		const el = stageRef.current
		if (!el) return

		const debug = isLandingStageDebug()
		sizeLogRef.current = isLandingStageSizeLog()
		let raf = 0
		const update = (reason: string) => {
			const tunerNow = tunerRef.current
			const { width, height } = el.getBoundingClientRect()
			if (width < 1 || height < 1) return

			const layoutKey = getLandingStageLayoutKey(variant, { featureIndex })
			const override = stageId ? tunerNow?.getOverride(stageId) : undefined
			const resolvedSlots =
				stageId && tunerNow ? tunerNow.resolveSlots(stageId, layoutKey) : getLandingStageDevices(layoutKey)

			const scaleOpts = featureIndex != null ? LANDING_STAGE_FEATURE_SCALE_OPTIONS : LANDING_STAGE_HERO_SCALE_OPTIONS
			const tunerOpts =
				override?.layoutKey === layoutKey
					? {
							scaleOverride: override.scaleOverride,
							padding: override.padding,
							fitMargin: override.fitMargin
						}
					: {}

			const result = computeLandingStageScaleResult(width, height, resolvedSlots, {
				layoutKey,
				debugLabel: `landing-stage:${variant}:${layoutKey}`,
				...scaleOpts,
				...tunerOpts
			})
			applyLandingStageLayout(el, result)

			const firstReady = !readyRef.current
			if (firstReady) {
				readyRef.current = true
				el.classList.add('landing-stage--ready')
			}

			if (sizeLogRef.current) {
				const slot = (el.closest('.landing-hero__showcase') ??
					el.closest('.landing-feature__visual')) as HTMLElement | null
				const slotH = slot?.getBoundingClientRect().height
				const prev = lastSlotHeightRef.current
				const delta = slotH != null && prev != null ? slotH - prev : undefined
				if (slotH != null) lastSlotHeightRef.current = slotH

				logLandingStageSize(el, {
					reason,
					variant,
					stageId,
					layoutKey,
					clusterScale: result.scale,
					firstReady,
					prevSlotH: prev,
					deltaSlotH: delta != null && Math.abs(delta) > 0.5 ? delta : undefined
				})
			}

			setDebugReport(debug ? formatLandingStageScaleReport(result) : null)
		}

		const schedule = (reason: string) => {
			cancelAnimationFrame(raf)
			raf = requestAnimationFrame(() => update(reason))
		}

		if (sizeLogRef.current) {
			logLandingStageSize(el, { reason: 'before-layout', variant, stageId })
		}
		update('mount-sync')
		const observer = new ResizeObserver(() => schedule('resize'))
		observer.observe(el)
		const onOrientation = () => schedule('orientation')
		window.addEventListener('orientationchange', onOrientation)

		return () => {
			cancelAnimationFrame(raf)
			observer.disconnect()
			window.removeEventListener('orientationchange', onOrientation)
			if (debug) setDebugReport(null)
		}
	}, [variant, stageId, featureIndex, overrideRevision])

	return { stageRef, debugReport }
}
