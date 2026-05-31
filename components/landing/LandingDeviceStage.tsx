'use client'

import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import type { KeyboardEvent, MouseEvent, SyntheticEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DeviceScreen, IPadMockup, IPhoneMockup } from '@/components/device'
import { useLandingStageFocus } from '@/hooks/useLandingStageFocus'
import { useLandingStageScale } from '@/hooks/useLandingStageScale'
import { getLandingStageScreenshots } from '@/lib/app-screenshot'
import { isLandingFocusBlurEnabled } from '@/lib/landing-focus-blur'
import { clearLandingFocusPresent, setLandingFocusPresent } from '@/lib/landing-focus-dom-state'
import type { LandingStageLayoutKey } from '@/lib/landing-stage-scale'
import { getLandingStageLayoutKey } from '@/lib/landing-stage-scale'
import { landingStageId } from '@/lib/landing-stage-tuner'
import type { LandingFeatureVisual } from '@/types/landing'
import LandingStageDebugPanel from './LandingStageDebugPanel'
import { createInitialOverride, useLandingStageTunerStage } from './LandingStageTunerContext'

type Variant = 'hero' | 'compact' | LandingFeatureVisual
type ScrimMotionState = {
	opacity: number
	'--landing-stage-scrim-blur': string
}

type Props = {
	appSlug: string
	appName: string
	variant?: Variant
	/** Deep feature section index (alternates mockup left/right). */
	featureIndex?: number
	className?: string
}

type DeviceId = 'ipad' | 'iphone'

const APPLE_ENTER_EASE = [0.32, 0.72, 0, 1] as const
const APPLE_EXIT_EASE = [0.32, 0, 0.67, 0] as const
const DEVICE_RETURN_TRANSITION = { duration: 0.5, ease: APPLE_ENTER_EASE }
const DEVICE_EXIT_TRANSITION = { duration: 0.46, ease: APPLE_EXIT_EASE }
const DEVICE_RETURN_TRANSITION_NO_OPACITY = { ...DEVICE_RETURN_TRANSITION, opacity: { duration: 0 } }
const DEVICE_EXIT_TRANSITION_NO_OPACITY = { ...DEVICE_EXIT_TRANSITION, opacity: { duration: 0 } }
const SCRIM_ENTER_TRANSITION = { duration: 0.36, ease: APPLE_ENTER_EASE }
const SCRIM_EXIT_TRANSITION = DEVICE_EXIT_TRANSITION
const SECONDARY_DELAYED_RETURN_MS = (DEVICE_EXIT_TRANSITION.duration * 1000) / 2
const SCRIM_INITIAL = { opacity: 0, '--landing-stage-scrim-blur': '0px' } as ScrimMotionState
const SCRIM_ANIMATE = { opacity: 1, '--landing-stage-scrim-blur': '12px' } as ScrimMotionState
const SCRIM_ANIMATE_NO_BLUR = { opacity: 1, '--landing-stage-scrim-blur': '0px' } as ScrimMotionState
const SCRIM_EXIT = SCRIM_INITIAL

type FocusOverlay = {
	device: DeviceId
	from: DOMRect
	target: FocusBox
	secondary?: {
		device: DeviceId
		from: DOMRect
		zIndex: number
		target: {
			x: number
			y: number
			scale: number
		}
		delayReturn: boolean
		delayReturnMs: number
	}
}

type FocusBox = {
	left: number
	top: number
	width: number
	height: number
}

function getStageDevice(stage: HTMLElement | null, device: DeviceId) {
	return stage?.querySelector<HTMLElement>(`.landing-stage__device--${device}`) ?? null
}

function toDocumentBox(box: FocusBox): FocusBox {
	return {
		left: box.left + window.scrollX,
		top: box.top + window.scrollY,
		width: box.width,
		height: box.height
	}
}

function toBoxFromTransform(from: DOMRect, target: { x: number; y: number; scale: number }): FocusBox {
	return {
		left: from.left + target.x,
		top: from.top + target.y,
		width: from.width * target.scale,
		height: from.height * target.scale
	}
}

function toViewportBox(rect: DOMRect): FocusBox {
	return {
		left: rect.left,
		top: rect.top,
		width: rect.width,
		height: rect.height
	}
}

function getSecondaryLiveBoxes(stage: HTMLElement | null, secondary: NonNullable<FocusOverlay['secondary']>) {
	const el = getStageDevice(stage, secondary.device)
	if (!el) return null
	const from = el.getBoundingClientRect()
	const fromBox = toViewportBox(from)
	const retreated = toBoxFromTransform(from, secondary.target)

	return {
		viewportFrom: fromBox,
		viewportRetreated: retreated,
		documentFrom: toDocumentBox(fromBox),
		documentRetreated: toDocumentBox(retreated)
	}
}

function getDeviceZIndex(el: HTMLElement) {
	const z = Number.parseFloat(getComputedStyle(el).zIndex)
	return Number.isFinite(z) ? z : 0
}

function getSecondaryOverlay(el: HTMLElement, device: DeviceId): FocusOverlay['secondary'] {
	const otherDevice: DeviceId = device === 'ipad' ? 'iphone' : 'ipad'
	const stage = el.closest<HTMLElement>('.landing-stage')
	const otherEl = getStageDevice(stage, otherDevice)
	if (!otherEl) return undefined

	const activeZ = getDeviceZIndex(el)
	const otherZ = getDeviceZIndex(otherEl)
	if (activeZ >= otherZ) return undefined

	const activeRect = el.getBoundingClientRect()
	const otherRect = otherEl.getBoundingClientRect()
	const activeCenterX = activeRect.left + activeRect.width / 2
	const otherCenterX = otherRect.left + otherRect.width / 2
	const direction = otherCenterX >= activeCenterX ? 1 : -1

	const activeCenterOffset = Math.abs(window.innerWidth / 2 - activeCenterX)
	const maxCenterOffset = Math.max(1, window.innerWidth / 2)
	const retreatFactor = Math.max(0, Math.min(1, 1 - activeCenterOffset / maxCenterOffset))
	const distance = otherRect.width * 1.25 * retreatFactor

	return {
		device: otherDevice,
		from: otherRect,
		zIndex: otherZ,
		target: {
			x: direction * distance,
			y: 0,
			scale: 0.9
		},
		delayReturn: retreatFactor > 0,
		delayReturnMs: SECONDARY_DELAYED_RETURN_MS * retreatFactor
	}
}

function getDeviceFocusTarget(rect: DOMRect): FocusOverlay['target'] {
	const inset = Math.max(24, Math.min(window.innerWidth, window.innerHeight) * 0.06)
	const availableWidth = Math.max(1, window.innerWidth - inset * 2)
	const availableHeight = Math.max(1, window.innerHeight - inset * 2)
	const scale = Math.max(1.04, Math.min(availableWidth / rect.width, availableHeight / rect.height))
	const targetWidth = rect.width * scale
	const targetHeight = rect.height * scale

	return {
		left: (window.innerWidth - targetWidth) / 2,
		top: (window.innerHeight - targetHeight) / 2,
		width: targetWidth,
		height: targetHeight
	}
}

function getFocusOverlay(el: HTMLElement, device: DeviceId): FocusOverlay {
	const rect = el.getBoundingClientRect()

	return {
		device,
		from: rect,
		target: getDeviceFocusTarget(rect),
		secondary: getSecondaryOverlay(el, device)
	}
}

function getDeviceStageLayoutKey(appSlug: string, variant: Variant, featureIndex?: number): LandingStageLayoutKey {
	if (appSlug === 'aqi-sense' && variant === 'map') return 'iphone-left'
	if (appSlug === 'aqi-sense' && featureIndex != null) return 'default'
	return getLandingStageLayoutKey(variant, { featureIndex })
}

export default function LandingDeviceStage({ appSlug, appName, variant = 'hero', featureIndex, className }: Props) {
	const stageId = landingStageId(appSlug, variant)
	const layoutKey = getDeviceStageLayoutKey(appSlug, variant, featureIndex)
	const { tuner, enabled: tunerEnabled, isActive } = useLandingStageTunerStage(appSlug, variant)
	const { stageRef, debugReport, ready } = useLandingStageScale(variant, { stageId, featureIndex, layoutKey })
	const { phone: phoneScreenshot, tablet: tabletScreenshot } = getLandingStageScreenshots(appSlug, variant)
	const focusEnabled = !tunerEnabled
	const focusBlurEnabled = isLandingFocusBlurEnabled()
	const [portalReady, setPortalReady] = useState(false)
	const [focusOverlay, setFocusOverlay] = useState<FocusOverlay | null>(null)
	const [restoreDevice, setRestoreDevice] = useState<DeviceId | null>(null)
	const [activeCloneDone, setActiveCloneDone] = useState(false)
	const [secondaryExitEnabled, setSecondaryExitEnabled] = useState(false)
	const [secondarySync, setSecondarySync] = useState(0)
	const [activeCloneReady, setActiveCloneReady] = useState(false)
	const [secondaryCloneReady, setSecondaryCloneReady] = useState(false)
	const isFocusedRef = useRef(false)
	const presentTokenRef = useRef(Symbol(`landing-stage-present:${stageId}`))
	const refreshFocusOverlayFromDom = useCallback(() => {
		setFocusOverlay((current) => {
			if (!current) return current
			const el = getStageDevice(stageRef.current, current.device)
			if (!el) return current
			const rect = el.getBoundingClientRect()

			if (!isFocusedRef.current) {
				return { ...current, from: rect }
			}

			const next = getFocusOverlay(el, current.device)
			return {
				...next,
				secondary: current.secondary
			}
		})
	}, [stageRef])
	const syncFocusOverlayBeforeExit = useCallback(() => {
		refreshFocusOverlayFromDom()
	}, [refreshFocusOverlayFromDom])
	const { focusedDevice, isFocused, onDeviceClick, onDeviceKeyDown, onScrimClick } = useLandingStageFocus({
		stageId,
		disabled: !focusEnabled,
		onBeforeClearFocus: syncFocusOverlayBeforeExit
	})
	isFocusedRef.current = isFocused

	useEffect(() => {
		setPortalReady(true)
	}, [])

	useEffect(() => {
		const active = isFocused || focusOverlay != null
		setLandingFocusPresent(presentTokenRef.current, active)
	}, [isFocused, focusOverlay])

	useEffect(() => {
		return () => {
			clearLandingFocusPresent(presentTokenRef.current)
		}
	}, [])

	const handleStageClick = (e: MouseEvent | KeyboardEvent) => {
		e.stopPropagation()
		if (!tunerEnabled || !tuner?.enabled || !stageRef.current) return
		const existing = tuner.getOverride(stageId)
		tuner.open({ stageId, variant, layoutKey, appSlug }, existing ?? createInitialOverride(layoutKey))
	}

	const setFocusOverlayFromTarget = (device: DeviceId, target: EventTarget & Element) => {
		if (typeof window === 'undefined') return
		setRestoreDevice(null)
		setActiveCloneDone(false)
		setSecondaryExitEnabled(false)
		setActiveCloneReady(false)
		setSecondaryCloneReady(false)
		setFocusOverlay(getFocusOverlay(target as HTMLElement, device))
	}

	const clearRestoreDevice = () => {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => setRestoreDevice(null))
		})
	}

	const handleActiveCloneExitComplete = useCallback(() => {
		const device = focusOverlay?.device ?? null
		setActiveCloneDone(true)
		setRestoreDevice(device)
		clearRestoreDevice()
		if (focusOverlay?.secondary?.delayReturn) {
			return
		}
		setFocusOverlay(null)
	}, [focusOverlay])

	useEffect(() => {
		if (!focusOverlay || typeof window === 'undefined') return
		let raf = 0
		const refresh = () => {
			window.cancelAnimationFrame(raf)
			raf = window.requestAnimationFrame(refreshFocusOverlayFromDom)
		}

		window.addEventListener('resize', refresh)
		window.visualViewport?.addEventListener('resize', refresh)
		return () => {
			window.cancelAnimationFrame(raf)
			window.removeEventListener('resize', refresh)
			window.visualViewport?.removeEventListener('resize', refresh)
		}
	}, [focusOverlay, refreshFocusOverlayFromDom])

	useEffect(() => {
		if (!focusOverlay?.secondary || isFocused || typeof window === 'undefined') return
		let raf = 0
		const refresh = () => {
			window.cancelAnimationFrame(raf)
			raf = window.requestAnimationFrame(() => setSecondarySync((value) => value + 1))
		}

		window.addEventListener('scroll', refresh, { passive: true })
		window.addEventListener('resize', refresh)
		window.visualViewport?.addEventListener('resize', refresh)
		return () => {
			window.cancelAnimationFrame(raf)
			window.removeEventListener('scroll', refresh)
			window.removeEventListener('resize', refresh)
			window.visualViewport?.removeEventListener('resize', refresh)
		}
	}, [focusOverlay?.secondary, isFocused])

	useEffect(() => {
		if (isFocused || !focusOverlay?.secondary?.delayReturn || secondaryExitEnabled) return
		const timeout = window.setTimeout(() => setSecondaryExitEnabled(true), focusOverlay.secondary.delayReturnMs)
		return () => window.clearTimeout(timeout)
	}, [isFocused, focusOverlay, secondaryExitEnabled])

	const handleSecondaryCloneExitComplete = () => {
		const device = focusOverlay?.secondary?.device ?? null
		setRestoreDevice(device)
		setFocusOverlay(null)
		setActiveCloneDone(false)
		setSecondaryExitEnabled(false)
		clearRestoreDevice()
	}

	const deviceProps = (device: DeviceId) => {
		if (!focusEnabled) return {}
		const pressed = focusedDevice === device
		return {
			role: 'button' as const,
			tabIndex: 0,
			'aria-pressed': pressed,
			'aria-label': device === 'ipad' ? `Focus ${appName} on iPad` : `Focus ${appName} on iPhone`,
			onClick: (e: MouseEvent) => {
				if (focusedDevice !== device) setFocusOverlayFromTarget(device, e.currentTarget)
				onDeviceClick(device, e)
			},
			onKeyDown: (e: KeyboardEvent) => {
				if ((e.key === 'Enter' || e.key === ' ') && focusedDevice !== device) {
					setFocusOverlayFromTarget(device, e.currentTarget)
				}
				onDeviceKeyDown(device, e)
			}
		}
	}

	const focusDevice = focusedDevice ?? focusOverlay?.device
	const focusVisible = isFocused || focusOverlay != null
	const activeCloneInitial = focusOverlay ? toDocumentBox(focusOverlay.from) : null
	const activeCloneAnimate = focusOverlay
		? isFocused
			? activeCloneReady
				? toDocumentBox(focusOverlay.target)
				: activeCloneInitial
			: toDocumentBox(focusOverlay.from)
		: null
	const focusZActive = focusVisible && !activeCloneDone
	void secondarySync
	const secondaryLive = focusOverlay?.secondary ? getSecondaryLiveBoxes(stageRef.current, focusOverlay.secondary) : null
	const secondaryInitial = secondaryLive ? secondaryLive.documentFrom : null
	const secondaryAnimate = secondaryLive
		? isFocused
			? secondaryCloneReady
				? secondaryLive.documentRetreated
				: secondaryLive.documentFrom
			: secondaryExitEnabled
				? secondaryLive.documentFrom
				: secondaryLive.documentRetreated
		: null
	const secondaryZIndex = isFocused ? undefined : focusOverlay?.secondary?.zIndex
	const secondaryTransition = isFocused
		? secondaryCloneReady
			? DEVICE_RETURN_TRANSITION
			: { duration: 0 }
		: secondaryExitEnabled
			? DEVICE_EXIT_TRANSITION
			: { duration: 0 }
	const stageClassName = clsx(
		'landing-stage',
		featureIndex != null && 'landing-stage--feature',
		(variant === 'hero' || variant === 'compact') && `landing-stage--${variant}`,
		variant !== 'hero' && variant !== 'compact' && `landing-stage--${variant}`,
		ready && 'landing-stage--ready',
		focusEnabled && 'landing-stage--interactive',
		focusVisible && 'landing-stage--focused',
		focusZActive && focusDevice === 'ipad' && 'landing-stage--focus-ipad',
		focusZActive && focusDevice === 'iphone' && 'landing-stage--focus-iphone',
		tunerEnabled && 'landing-stage--tuner-target',
		isActive && 'landing-stage--tuner-active',
		className
	)

	const renderDeviceMockup = (
		device: DeviceId,
		suffix = '',
		onScreenLoad?: (event: SyntheticEvent<HTMLImageElement>) => void
	) => {
		const priority = variant === 'hero' || suffix !== ''
		if (device === 'ipad') {
			return (
				<IPadMockup instanceId={`${stageId}-ipad${suffix}`} wrapperClassName="landing-stage__mockup">
					<DeviceScreen
						src={tabletScreenshot}
						alt={`${appName} on iPad`}
						className="landing-stage__screen landing-stage__screen--tablet"
						priority={priority}
						sizes="(max-width: 1100px) 52vw, 560px"
						onLoad={onScreenLoad}
					/>
				</IPadMockup>
			)
		}

		return (
			<IPhoneMockup instanceId={`${stageId}-iphone${suffix}`} wrapperClassName="landing-stage__mockup">
				<DeviceScreen
					src={phoneScreenshot}
					alt={`${appName} screenshot`}
					className="landing-stage__screen landing-stage__screen--phone"
					priority={priority}
					sizes="(max-width: 1100px) 38vw, 320px"
					onLoad={onScreenLoad}
				/>
			</IPhoneMockup>
		)
	}

	const deviceMotion = (device: DeviceId) => {
		if (restoreDevice === device) {
			return {
				opacity: 1,
				x: 0,
				y: 0,
				scale: 1,
				transition: { duration: 0 }
			}
		}

		const isActiveOriginal = focusVisible && activeCloneReady && device === focusDevice && !activeCloneDone
		const isSecondaryOriginal = secondaryCloneReady && focusOverlay?.secondary?.device === device
		return {
			opacity: isActiveOriginal || isSecondaryOriginal ? 0 : 1,
			x: 0,
			y: 0,
			scale: 1,
			transition: !isFocused && focusOverlay ? DEVICE_EXIT_TRANSITION_NO_OPACITY : DEVICE_RETURN_TRANSITION_NO_OPACITY
		}
	}

	const renderDevices = () => (
		<>
			<div className="landing-stage__device landing-stage__device--ipad" {...deviceProps('ipad')}>
				<motion.div className="landing-stage__device-motion" animate={deviceMotion('ipad')}>
					{renderDeviceMockup('ipad')}
				</motion.div>
			</div>
			<div className="landing-stage__device landing-stage__device--iphone" {...deviceProps('iphone')}>
				<motion.div className="landing-stage__device-motion" animate={deviceMotion('iphone')}>
					{renderDeviceMockup('iphone')}
				</motion.div>
			</div>
		</>
	)

	return (
		<>
			<div
				ref={stageRef}
				className={stageClassName}
				data-layout={layoutKey}
				aria-hidden={tunerEnabled ? true : undefined}
				onClick={tunerEnabled ? handleStageClick : undefined}
				onKeyDown={
					tunerEnabled
						? (e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault()
									handleStageClick(e)
								}
							}
						: undefined
				}
				role={tunerEnabled ? 'button' : undefined}
				tabIndex={tunerEnabled ? 0 : undefined}
			>
				<div className="landing-stage__glow" />
				<div className="landing-stage__cluster">{renderDevices()}</div>
			</div>
			{portalReady && (isFocused || focusOverlay)
				? createPortal(
						<AnimatePresence>
							{isFocused ? (
								<motion.button
									key="landing-stage-scrim"
									type="button"
									className="landing-stage-scrim"
									aria-label="Close device preview"
									onClick={onScrimClick}
									initial={SCRIM_INITIAL}
									animate={focusBlurEnabled ? SCRIM_ANIMATE : SCRIM_ANIMATE_NO_BLUR}
									exit={SCRIM_EXIT}
									transition={isFocused ? SCRIM_ENTER_TRANSITION : SCRIM_EXIT_TRANSITION}
								/>
							) : null}
						</AnimatePresence>,
						document.body
					)
				: null}
			{portalReady && focusOverlay && !activeCloneDone
				? createPortal(
						<div className={clsx('landing-stage-focus-layer', 'landing-stage-focus-layer--document')} aria-hidden>
							<motion.div
								key={`${stageId}-${focusOverlay.device}-focus`}
								className={clsx('landing-stage-focus-clone', `landing-stage-focus-clone--${focusOverlay.device}`)}
								initial={{
									left: activeCloneInitial?.left,
									top: activeCloneInitial?.top,
									width: activeCloneInitial?.width,
									height: activeCloneInitial?.height
								}}
								animate={{
									...activeCloneAnimate,
									opacity: isFocused && !activeCloneReady ? 0 : 1,
									transition: isFocused
										? activeCloneReady
											? { duration: 0.62, ease: [0.22, 1, 0.36, 1], opacity: { duration: 0 } }
											: { duration: 0 }
										: { duration: 0.58, ease: [0.64, 0, 0.78, 0], opacity: { duration: 0 } }
								}}
								onAnimationComplete={() => {
									if (!isFocused) handleActiveCloneExitComplete()
								}}
							>
								{renderDeviceMockup(focusOverlay.device, '-focus-clone', () => setActiveCloneReady(true))}
							</motion.div>
						</div>,
						document.body
					)
				: null}
			{portalReady && focusOverlay?.secondary
				? createPortal(
						<div
							className={clsx(
								'landing-stage-focus-underlay',
								'landing-stage-focus-underlay--document',
								!isFocused && 'landing-stage-focus-underlay--returning'
							)}
							aria-hidden
						>
							<motion.div
								key={`${stageId}-${focusOverlay.secondary.device}-secondary`}
								className={clsx(
									'landing-stage-focus-clone',
									'landing-stage-focus-clone--secondary',
									`landing-stage-focus-clone--${focusOverlay.secondary.device}`
								)}
								initial={{
									left: secondaryInitial?.left,
									top: secondaryInitial?.top,
									width: secondaryInitial?.width,
									height: secondaryInitial?.height,
									zIndex: secondaryZIndex
								}}
								animate={{
									...secondaryAnimate,
									opacity: isFocused && !secondaryCloneReady ? 0 : 1,
									zIndex: secondaryZIndex,
									transition: { ...secondaryTransition, opacity: { duration: 0 } }
								}}
								onAnimationComplete={() => {
									if (!isFocused && secondaryExitEnabled) handleSecondaryCloneExitComplete()
								}}
							>
								{renderDeviceMockup(focusOverlay.secondary.device, '-secondary-clone', () =>
									setSecondaryCloneReady(true)
								)}
							</motion.div>
						</div>,
						document.body
					)
				: null}
			{debugReport ? <LandingStageDebugPanel text={debugReport} /> : null}
		</>
	)
}
