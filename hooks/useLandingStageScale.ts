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
	LANDING_STAGE_HERO_SCALE_OPTIONS,
	publishLandingHeroClusterScale
} from '@/lib/landing-stage-scale'
import { isLandingStageSizeLog, logLandingStageSize } from '@/lib/landing-stage-size-log'

type Variant = 'hero' | 'compact' | string

type Options = {
	stageId?: string
	featureIndex?: number
}

function getHeroMeasureElement(stage: HTMLElement): HTMLElement {
	return (stage.closest('.landing-hero__showcase') as HTMLElement | null) ?? stage
}

function getFeatureMeasureElement(stage: HTMLElement): HTMLElement {
	return (stage.closest('.landing-feature__visual') as HTMLElement | null) ?? stage
}

/** Positions mockups inside a fixed-size stage box (CSS owns outer dimensions). */
export function useLandingStageScale(variant: Variant = 'hero', options: Options = {}) {
	const stageRef = useRef<HTMLDivElement>(null)
	const [debugReport, setDebugReport] = useState<string | null>(null)
	const tuner = useLandingStageTunerOptional()
	const { stageId, featureIndex } = options
	const isFeature = featureIndex != null
	const overrideRevision = tuner?.overrideRevision ?? 0
	const tunerRef = useRef(tuner)
	tunerRef.current = tuner
	const readyRef = useRef(false)

	useLayoutEffect(() => {
		readyRef.current = false
		stageRef.current?.classList.remove('landing-stage--ready')
	}, [variant, stageId, featureIndex])

	useLayoutEffect(() => {
		const el = stageRef.current
		if (!el) return

		if (isFeature) {
			const layoutKey = getLandingStageLayoutKey(variant, { featureIndex })
			const tunerNow = tunerRef.current
			const override = stageId ? tunerNow?.getOverride(stageId) : undefined
			const resolvedSlots =
				stageId && tunerNow ? tunerNow.resolveSlots(stageId, layoutKey) : getLandingStageDevices(layoutKey)
			const measureEl = getFeatureMeasureElement(el)
			let raf = 0

			const tunerOpts =
				override?.layoutKey === layoutKey
					? {
							scaleOverride: override.scaleOverride,
							padding: override.padding,
							fitMargin: override.fitMargin
						}
					: {}

			const update = () => {
				const { width, height } = measureEl.getBoundingClientRect()
				if (width < 1 || height < 1) return

				const result = computeLandingStageScaleResult(width, height, resolvedSlots, {
					layoutKey,
					debugLabel: `landing-stage:feature:${layoutKey}`,
					...LANDING_STAGE_FEATURE_SCALE_OPTIONS,
					...tunerOpts
				})
				applyLandingStageLayout(el, result)
			}

			const schedule = () => {
				cancelAnimationFrame(raf)
				raf = requestAnimationFrame(update)
			}

			schedule()
			const observer = new ResizeObserver(schedule)
			observer.observe(measureEl)
			el.classList.add('landing-stage--ready')

			return () => {
				cancelAnimationFrame(raf)
				observer.disconnect()
			}
		}

		const debug = isLandingStageDebug()
		const sizeLog = isLandingStageSizeLog()
		let raf = 0
		const measureEl = getHeroMeasureElement(el)

		const update = (reason: string) => {
			const tunerNow = tunerRef.current
			const { width, height } = measureEl.getBoundingClientRect()
			if (width < 1 || height < 1) return

			const layoutKey = getLandingStageLayoutKey(variant)
			const override = stageId ? tunerNow?.getOverride(stageId) : undefined
			const resolvedSlots =
				stageId && tunerNow ? tunerNow.resolveSlots(stageId, layoutKey) : getLandingStageDevices(layoutKey)

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
				...LANDING_STAGE_HERO_SCALE_OPTIONS,
				...tunerOpts
			})
			applyLandingStageLayout(el, result)
			publishLandingHeroClusterScale(result.scale)

			if (!readyRef.current) {
				readyRef.current = true
				el.classList.add('landing-stage--ready')
			}

			if (sizeLog) {
				logLandingStageSize(el, {
					reason,
					variant,
					stageId,
					layoutKey,
					clusterScale: result.scale,
					firstReady: readyRef.current
				})
			}

			setDebugReport(debug ? formatLandingStageScaleReport(result) : null)
		}

		const schedule = (reason: string) => {
			cancelAnimationFrame(raf)
			raf = requestAnimationFrame(() => update(reason))
		}

		update('mount-sync')
		const observer = new ResizeObserver(() => schedule('resize'))
		observer.observe(measureEl)
		if (measureEl !== el) observer.observe(el)
		const onOrientation = () => schedule('orientation')
		window.addEventListener('orientationchange', onOrientation)

		return () => {
			cancelAnimationFrame(raf)
			observer.disconnect()
			window.removeEventListener('orientationchange', onOrientation)
			if (debug) setDebugReport(null)
		}
	}, [variant, stageId, featureIndex, isFeature, overrideRevision])

	return { stageRef, debugReport: isFeature ? null : debugReport }
}
