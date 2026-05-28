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
	LANDING_STAGE_SCALE_OPTIONS
} from '@/lib/landing-stage-scale'

type Variant = 'hero' | 'compact' | string

type Options = {
	stageId?: string
}

export function useLandingStageScale(variant: Variant = 'hero', options: Options = {}) {
	const stageRef = useRef<HTMLDivElement>(null)
	const [debugReport, setDebugReport] = useState<string | null>(null)
	const tuner = useLandingStageTunerOptional()
	const { stageId } = options
	const overrideRevision = tuner?.overrideRevision ?? 0
	const tunerRef = useRef(tuner)
	tunerRef.current = tuner

	useLayoutEffect(() => {
		const el = stageRef.current
		if (!el) return

		const debug = isLandingStageDebug()
		let raf = 0

		const update = () => {
			const tunerNow = tunerRef.current
			const { width, height } = el.getBoundingClientRect()
			const layoutKey = getLandingStageLayoutKey(variant, width)
			const override = stageId ? tunerNow?.getOverride(stageId) : undefined
			const resolvedSlots =
				stageId && tunerNow
					? tunerNow.resolveSlots(stageId, layoutKey)
					: getLandingStageDevices(layoutKey)

			const scaleOpts = LANDING_STAGE_SCALE_OPTIONS[layoutKey] ?? {}
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
			setDebugReport(debug ? formatLandingStageScaleReport(result) : null)
		}

		const scheduleUpdate = () => {
			cancelAnimationFrame(raf)
			raf = requestAnimationFrame(update)
		}

		scheduleUpdate()
		const observer = new ResizeObserver(scheduleUpdate)
		observer.observe(el)
		window.addEventListener('orientationchange', scheduleUpdate)

		return () => {
			cancelAnimationFrame(raf)
			observer.disconnect()
			window.removeEventListener('orientationchange', scheduleUpdate)
			if (debug) setDebugReport(null)
		}
	}, [variant, stageId, overrideRevision])

	return { stageRef, debugReport }
}
