'use client'

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
	cloneLandingStageSlots,
	getLandingStageDevices,
	type LandingStageLayoutKey,
	type StageDeviceSlot
} from '@/lib/landing-stage-scale'
import { isLandingStageTuner, isLandingStageTunerFromEnv, landingStageId } from '@/lib/landing-stage-tuner'

export type LandingStageTunerOverride = {
	layoutKey: LandingStageLayoutKey
	slots: StageDeviceSlot[]
	scaleOverride?: number
	fitMargin?: number
	shadowPad?: number
	padding?: number
}

export type LandingStageTunerActive = {
	stageId: string
	variant: string
	layoutKey: LandingStageLayoutKey
	appSlug: string
}

type LandingStageTunerContextValue = {
	enabled: boolean
	active: LandingStageTunerActive | null
	paneOpen: boolean
	paneGeneration: number
	/** Bumps when any stage override changes (for layout hooks). */
	overrideRevision: number
	open: (active: LandingStageTunerActive, initial?: LandingStageTunerOverride) => void
	close: () => void
	getOverride: (stageId: string) => LandingStageTunerOverride | undefined
	resolveSlots: (stageId: string, layoutKey: LandingStageLayoutKey) => StageDeviceSlot[]
	updateOverride: (stageId: string, override: LandingStageTunerOverride) => void
	resetOverride: (stageId: string, layoutKey: LandingStageLayoutKey) => void
}

function overridesEqual(a: LandingStageTunerOverride, b: LandingStageTunerOverride) {
	return (
		a.layoutKey === b.layoutKey &&
		a.scaleOverride === b.scaleOverride &&
		a.fitMargin === b.fitMargin &&
		a.shadowPad === b.shadowPad &&
		a.padding === b.padding &&
		JSON.stringify(a.slots) === JSON.stringify(b.slots)
	)
}

const LandingStageTunerContext = createContext<LandingStageTunerContextValue | null>(null)

function mergeSlotsForLayout(layoutKey: LandingStageLayoutKey, override?: StageDeviceSlot[]): StageDeviceSlot[] {
	const defaults = getLandingStageDevices(layoutKey)
	if (!override) return defaults
	return defaults.map((def) => {
		const edited = override.find((s) => s.id === def.id)
		if (!edited) return def
		return {
			...def,
			x: edited.x,
			y: edited.y,
			left: edited.left,
			right: edited.right,
			top: edited.top,
			rotate: edited.rotate,
			scaleMult: edited.scaleMult,
			zIndex: edited.zIndex
		}
	})
}

export function LandingStageTunerProvider({ children }: { children: ReactNode }) {
	const [enabled, setEnabled] = useState(isLandingStageTunerFromEnv)
	const [active, setActive] = useState<LandingStageTunerActive | null>(null)
	const [paneOpen, setPaneOpen] = useState(false)
	const [overrides, setOverrides] = useState<Record<string, LandingStageTunerOverride>>({})
	const overridesRef = useRef(overrides)
	overridesRef.current = overrides
	const [paneGeneration, setPaneGeneration] = useState(0)
	const [overrideRevision, setOverrideRevision] = useState(0)

	useEffect(() => {
		setEnabled(isLandingStageTuner())
	}, [])

	const open = useCallback((next: LandingStageTunerActive, initial?: LandingStageTunerOverride) => {
		if (!isLandingStageTuner()) return
		setActive(next)
		setPaneOpen(true)
		if (initial) {
			setOverrides((prev) => ({ ...prev, [next.stageId]: initial }))
		}
	}, [])

	const close = useCallback(() => {
		setPaneOpen(false)
	}, [])

	const getOverride = useCallback((stageId: string) => overrides[stageId], [overrides])

	const resolveSlots = useCallback(
		(stageId: string, layoutKey: LandingStageLayoutKey) => {
			const override = overrides[stageId]
			return mergeSlotsForLayout(layoutKey, override?.slots)
		},
		[overrides]
	)

	const updateOverride = useCallback((stageId: string, override: LandingStageTunerOverride) => {
		const current = overridesRef.current[stageId]
		if (current && overridesEqual(current, override)) return
		setOverrides((prev) => ({ ...prev, [stageId]: override }))
		setOverrideRevision((n) => n + 1)
	}, [])

	const resetOverride = useCallback((stageId: string, layoutKey: LandingStageLayoutKey) => {
		setOverrides((prev) => {
			const next = { ...prev }
			delete next[stageId]
			return next
		})
		setActive((current) => (current?.stageId === stageId ? { ...current, layoutKey } : current))
		setPaneGeneration((n) => n + 1)
		setOverrideRevision((n) => n + 1)
	}, [])

	const value = useMemo(
		() => ({
			enabled,
			active,
			paneOpen,
			paneGeneration,
			overrideRevision,
			open,
			close,
			getOverride,
			resolveSlots,
			updateOverride,
			resetOverride
		}),
		[
			enabled,
			active,
			paneOpen,
			paneGeneration,
			overrideRevision,
			open,
			close,
			getOverride,
			resolveSlots,
			updateOverride,
			resetOverride
		]
	)

	return (
		<LandingStageTunerContext.Provider value={value}>
			{children}
			{enabled ? <LandingStageTunerHost /> : null}
		</LandingStageTunerContext.Provider>
	)
}

function LandingStageTunerHost() {
	const [Pane, setPane] = useState<typeof import('./LandingStageTunerPane').default | null>(null)

	useEffect(() => {
		void import('./LandingStageTunerPane').then((m) => setPane(() => m.default))
	}, [])

	return (
		<>
			<LandingStageTunerFab />
			{Pane ? <Pane /> : null}
		</>
	)
}

function LandingStageTunerFab() {
	const tuner = useLandingStageTunerOptional()
	if (!tuner?.enabled) return null

	const label = tuner.paneOpen && tuner.active ? `Tuner: ${tuner.active.variant}` : 'Stage tuner — click a mockup'

	return (
		<button
			type="button"
			className="landing-stage-tuner-fab"
			onClick={() => (tuner.paneOpen ? tuner.close() : undefined)}
			title="Click any device stage on the page to edit layout"
		>
			{label}
		</button>
	)
}

export function useLandingStageTunerOptional() {
	return useContext(LandingStageTunerContext)
}

export function useLandingStageTunerEnabled() {
	return useLandingStageTunerOptional()?.enabled === true
}

export function useLandingStageTunerStage(appSlug: string, variant: string) {
	const tuner = useLandingStageTunerOptional()
	const enabled = tuner?.enabled === true
	const stageId = landingStageId(appSlug, variant)
	const isActive = tuner?.active?.stageId === stageId && tuner.paneOpen === true

	return { tuner, enabled, stageId, isActive }
}

export function createInitialOverride(
	layoutKey: LandingStageLayoutKey,
	slots?: StageDeviceSlot[]
): LandingStageTunerOverride {
	return {
		layoutKey,
		slots: cloneLandingStageSlots(slots ?? getLandingStageDevices(layoutKey))
	}
}
