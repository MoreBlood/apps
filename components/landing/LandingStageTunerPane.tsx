'use client'

import { useEffect, useRef, useState } from 'react'
import type { StageDeviceId, StageDeviceSlot } from '@/lib/landing-stage-scale'
import {
	getStageDeviceZIndex,
	LANDING_STAGE_SCALE_OPTIONS,
	resolveSlotPosition,
	STAGE_ARTBOARD
} from '@/lib/landing-stage-scale'
import { formatLandingStageLayoutSnippet } from '@/lib/landing-stage-tuner'
import {
	createInitialOverride,
	type LandingStageTunerOverride,
	useLandingStageTunerOptional
} from './LandingStageTunerContext'

type DeviceBinding = {
	xPx: number
	yPx: number
	rotate: number
	scaleMult: number
	zIndex: number
}

type PaneParams = {
	clusterScale: number
	manualClusterScale: boolean
	fitMargin: number
	padding: number
}

function slotsToBindings(slots: StageDeviceSlot[]): Record<string, DeviceBinding> {
	const bindings: Record<string, DeviceBinding> = {}
	for (const slot of slots) {
		const { x, y } = resolveSlotPosition(slot)
		bindings[slot.id] = {
			xPx: Math.round(x),
			yPx: Math.round(y),
			rotate: slot.rotate,
			scaleMult: slot.scaleMult ?? 1,
			zIndex: getStageDeviceZIndex(slot)
		}
	}
	return bindings
}

function bindingsToSlots(slots: StageDeviceSlot[], bindings: Record<string, DeviceBinding>): StageDeviceSlot[] {
	return slots.map((slot) => {
		const binding = bindings[slot.id]
		if (!binding) return slot
		return {
			...slot,
			x: binding.xPx,
			y: binding.yPx,
			left: undefined,
			right: undefined,
			top: undefined,
			rotate: Math.round(binding.rotate),
			scaleMult: binding.scaleMult,
			zIndex: Math.round(binding.zIndex)
		}
	})
}

const DEVICE_LABELS: Record<StageDeviceId, string> = {
	ipad: 'iPad',
	iphone: 'iPhone',
	'iphone-secondary': 'iPhone (secondary)'
}

export default function LandingStageTunerPane() {
	const tuner = useLandingStageTunerOptional()
	const tunerRef = useRef(tuner)
	tunerRef.current = tuner

	const containerRef = useRef<HTMLDivElement>(null)
	const bindingsRef = useRef<Record<string, DeviceBinding>>({})
	const paramsRef = useRef<PaneParams>({
		clusterScale: 0.28,
		manualClusterScale: false,
		fitMargin: 1.06,
		padding: 12
	})
	const slotsRef = useRef<StageDeviceSlot[]>([])
	const activeRef = useRef(tuner?.active)
	activeRef.current = tuner?.active

	const [copyLabel, setCopyLabel] = useState('Copy config')

	const active = tuner?.active
	const paneOpen = tuner?.paneOpen
	const paneGeneration = tuner?.paneGeneration ?? 0
	const activeStageId = active?.stageId
	const activeLayoutKey = active?.layoutKey

	useEffect(() => {
		if (!paneOpen || !activeStageId || !activeLayoutKey || !containerRef.current) return

		const pushOverride = () => {
			const tunerNow = tunerRef.current
			const activeNow = activeRef.current
			if (!tunerNow || !activeNow) return

			const params = paramsRef.current
			const override: LandingStageTunerOverride = {
				layoutKey: activeNow.layoutKey,
				slots: bindingsToSlots(slotsRef.current, bindingsRef.current),
				scaleOverride: params.manualClusterScale ? params.clusterScale : undefined,
				fitMargin: params.fitMargin,
				padding: params.padding
			}
			tunerNow.updateOverride(activeNow.stageId, override)
		}

		const container = containerRef.current
		container.replaceChildren()

		let disposed = false
		let pane: import('tweakpane').Pane | undefined

		const tunerNow = tunerRef.current
		const override = tunerNow?.getOverride(activeStageId) ?? createInitialOverride(activeLayoutKey)
		slotsRef.current = override.slots
		bindingsRef.current = slotsToBindings(override.slots)

		const scaleOpts = LANDING_STAGE_SCALE_OPTIONS
		paramsRef.current = {
			clusterScale: override.scaleOverride ?? 0.28,
			manualClusterScale: override.scaleOverride != null,
			fitMargin: override.fitMargin ?? scaleOpts.fitMargin ?? 1.06,
			padding: override.padding ?? (scaleOpts.padding ?? 12) + (scaleOpts.filterBleed ?? 0)
		}

		const importPane = async () => {
			const { Pane } = await import('tweakpane')
			if (disposed || !containerRef.current) return

			pane = new Pane({
				container,
				title: `${activeRef.current?.variant ?? ''} · ${activeLayoutKey}`
			})

			const params = paramsRef.current
			const bindings = bindingsRef.current

			const scaleFolder = pane.addFolder({ title: 'Cluster fit', expanded: true })
			scaleFolder.addBinding(params, 'manualClusterScale', { label: 'manual scale' })
			scaleFolder.addBinding(params, 'clusterScale', {
				label: 'scale',
				min: 0.05,
				max: 1,
				step: 0.01
			})
			scaleFolder.addBinding(params, 'padding', {
				label: 'stage padding',
				min: 0,
				max: 80,
				step: 1
			})
			scaleFolder.addBinding(params, 'fitMargin', {
				label: 'fit margin',
				min: 1,
				max: 1.5,
				step: 0.01
			})

			for (const slot of slotsRef.current) {
				const binding = bindings[slot.id]
				if (!binding) continue
				const folder = pane.addFolder({
					title: DEVICE_LABELS[slot.id] ?? slot.id,
					expanded: slot.id === 'ipad'
				})
				folder.addBinding(binding, 'xPx', {
					label: 'x px',
					min: -Math.round(STAGE_ARTBOARD.w * 0.35),
					max: Math.round(STAGE_ARTBOARD.w * 0.35),
					step: 1
				})
				folder.addBinding(binding, 'yPx', {
					label: 'y px',
					min: -Math.round(STAGE_ARTBOARD.h * 0.35),
					max: Math.round(STAGE_ARTBOARD.h * 0.35),
					step: 1
				})
				folder.addBinding(binding, 'rotate', {
					label: 'rotate °',
					min: -45,
					max: 45,
					step: 1
				})
				folder.addBinding(binding, 'zIndex', {
					label: 'z-index',
					min: 0,
					max: 10,
					step: 1
				})
			}

			pane.on('change', () => {
				pushOverride()
			})
		}

		void importPane()

		return () => {
			disposed = true
			pane?.dispose()
			container.replaceChildren()
		}
	}, [paneOpen, activeStageId, activeLayoutKey, paneGeneration])

	if (!paneOpen || !active) return null

	const handleCopy = async () => {
		const params = paramsRef.current
		const slots = bindingsToSlots(slotsRef.current, bindingsRef.current)
		const text = formatLandingStageLayoutSnippet(active.layoutKey, slots, {
			manualClusterScale: params.manualClusterScale,
			scaleOverride: params.manualClusterScale ? params.clusterScale : undefined,
			padding: params.padding,
			fitMargin: params.fitMargin,
			maxScale: LANDING_STAGE_SCALE_OPTIONS.maxScale
		})
		try {
			await navigator.clipboard.writeText(text)
			setCopyLabel('Copied!')
			window.setTimeout(() => setCopyLabel('Copy config'), 1500)
		} catch {
			setCopyLabel('Copy failed')
		}
	}

	const handleReset = () => {
		tuner?.resetOverride(active.stageId, active.layoutKey)
	}

	return (
		<div className="landing-stage-tuner" data-nosnippet>
			<div className="landing-stage-tuner__bar">
				<span className="landing-stage-tuner__title">Stage tuner · {active.variant}</span>
				<div className="landing-stage-tuner__actions">
					<button type="button" className="landing-stage-tuner__btn" onClick={handleReset}>
						Reset
					</button>
					<button
						type="button"
						className="landing-stage-tuner__btn landing-stage-tuner__btn--primary"
						onClick={handleCopy}
					>
						{copyLabel}
					</button>
					<button type="button" className="landing-stage-tuner__btn" onClick={() => tuner?.close()}>
						Close
					</button>
				</div>
			</div>
			<p className="landing-stage-tuner__hint">
				Positions are px offsets from the artboard center ({STAGE_ARTBOARD.w}×{STAGE_ARTBOARD.h}). Cluster fit:
				padding = inset from edges; fit margin = scale divisor (above 1 shrinks).
			</p>
			<div ref={containerRef} className="landing-stage-tuner__pane" />
		</div>
	)
}
