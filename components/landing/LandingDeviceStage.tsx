'use client'

import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { DeviceScreen, IPadMockup, IPhoneMockup } from '@/components/device'
import { useLandingStageFocus } from '@/hooks/useLandingStageFocus'
import { useLandingStageScale } from '@/hooks/useLandingStageScale'
import { getLandingStageScreenshots } from '@/lib/app-screenshot'
import { getLandingStageLayoutKey } from '@/lib/landing-stage-scale'
import { landingStageId } from '@/lib/landing-stage-tuner'
import type { LandingFeatureVisual } from '@/types/landing'
import LandingStageDebugPanel from './LandingStageDebugPanel'
import { createInitialOverride, useLandingStageTunerStage } from './LandingStageTunerContext'

type Variant = 'hero' | 'compact' | LandingFeatureVisual

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
const SCRIM_ENTER_TRANSITION = { duration: 0.36, ease: APPLE_ENTER_EASE }
const SCRIM_EXIT_TRANSITION = DEVICE_EXIT_TRANSITION
const SECONDARY_DELAYED_RETURN_MS = (DEVICE_EXIT_TRANSITION.duration * 1000) / 2

type FocusOverlay = {
	device: DeviceId
	from: DOMRect
	target: {
		x: number
		y: number
		scale: number
	}
	secondary?: {
		device: DeviceId
		from: DOMRect
		target: {
			x: number
			y: number
			scale: number
		}
		delayReturn: boolean
	}
}

function getStageDevice(stage: HTMLElement | null, device: DeviceId) {
	return stage?.querySelector<HTMLElement>(`.landing-stage__device--${device}`) ?? null
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
	const direction = otherRect.left + otherRect.width / 2 >= activeRect.left + activeRect.width / 2 ? 1 : -1
	const distance = otherRect.width

	return {
		device: otherDevice,
		from: otherRect,
		target: {
			x: direction * distance,
			y: 40,
			scale: 0.9
		},
		delayReturn: true
	}
}

function getFocusOverlay(el: HTMLElement, device: DeviceId): FocusOverlay {
	const rect = el.getBoundingClientRect()
	const inset = Math.max(24, Math.min(window.innerWidth, window.innerHeight) * 0.06)
	const availableWidth = Math.max(1, window.innerWidth - inset * 2)
	const availableHeight = Math.max(1, window.innerHeight - inset * 2)
	const scale = Math.max(1.04, Math.min(availableWidth / rect.width, availableHeight / rect.height))
	const targetWidth = rect.width * scale
	const targetHeight = rect.height * scale

	return {
		device,
		from: rect,
		target: {
			x: (window.innerWidth - targetWidth) / 2 - rect.left,
			y: (window.innerHeight - targetHeight) / 2 - rect.top,
			scale
		},
		secondary: getSecondaryOverlay(el, device)
	}
}

export default function LandingDeviceStage({ appSlug, appName, variant = 'hero', featureIndex, className }: Props) {
	const stageId = landingStageId(appSlug, variant)
	const layoutKey = getLandingStageLayoutKey(variant, { featureIndex })
	const { tuner, enabled: tunerEnabled, isActive } = useLandingStageTunerStage(appSlug, variant)
	const { stageRef, debugReport, ready } = useLandingStageScale(variant, { stageId, featureIndex })
	const { phone: phoneScreenshot, tablet: tabletScreenshot } = getLandingStageScreenshots(appSlug, variant)
	const focusEnabled = !tunerEnabled
	const { focusedDevice, isFocused, onDeviceClick, onDeviceKeyDown, onScrimClick } = useLandingStageFocus({
		stageId,
		disabled: !focusEnabled
	})
	const [portalReady, setPortalReady] = useState(false)
	const [focusOverlay, setFocusOverlay] = useState<FocusOverlay | null>(null)
	const [restoreDevice, setRestoreDevice] = useState<DeviceId | null>(null)
	const [activeCloneDone, setActiveCloneDone] = useState(false)
	const [secondaryExitEnabled, setSecondaryExitEnabled] = useState(false)

	useEffect(() => {
		setPortalReady(true)
	}, [])

	useEffect(() => {
		if (typeof document === 'undefined') return
		const root = document.documentElement
		const active = isFocused || focusOverlay != null
		root.classList.toggle('landing-stage-focus-present', active)
		return () => {
			root.classList.remove('landing-stage-focus-present')
		}
	}, [isFocused, focusOverlay])

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
		setFocusOverlay(getFocusOverlay(target as HTMLElement, device))
	}

	const clearRestoreDevice = () => {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => setRestoreDevice(null))
		})
	}

	const handleActiveCloneExitComplete = () => {
		const device = focusOverlay?.device ?? null
		setActiveCloneDone(true)
		setRestoreDevice(device)
		clearRestoreDevice()
		if (focusOverlay?.secondary?.delayReturn) {
			return
		}
		setFocusOverlay(null)
	}

	useEffect(() => {
		if (isFocused || !focusOverlay?.secondary?.delayReturn || secondaryExitEnabled) return
		const timeout = window.setTimeout(() => setSecondaryExitEnabled(true), SECONDARY_DELAYED_RETURN_MS)
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
	const stageClassName = clsx(
		'landing-stage',
		featureIndex != null && 'landing-stage--feature',
		(variant === 'hero' || variant === 'compact') && `landing-stage--${variant}`,
		variant !== 'hero' && variant !== 'compact' && `landing-stage--${variant}`,
		ready && 'landing-stage--ready',
		focusEnabled && 'landing-stage--interactive',
		focusVisible && 'landing-stage--focused',
		focusVisible && focusDevice === 'ipad' && 'landing-stage--focus-ipad',
		focusVisible && focusDevice === 'iphone' && 'landing-stage--focus-iphone',
		tunerEnabled && 'landing-stage--tuner-target',
		isActive && 'landing-stage--tuner-active',
		className
	)

	const renderDeviceMockup = (device: DeviceId, suffix = '') => {
		if (device === 'ipad') {
			return (
				<IPadMockup instanceId={`${stageId}-ipad${suffix}`} wrapperClassName="landing-stage__mockup">
					<DeviceScreen
						src={tabletScreenshot}
						alt={`${appName} on iPad`}
						className="landing-stage__screen landing-stage__screen--tablet"
						priority={variant === 'hero'}
						sizes="(max-width: 1100px) 52vw, 560px"
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
					priority={variant === 'hero'}
					sizes="(max-width: 1100px) 38vw, 320px"
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

		const isActiveOriginal = focusVisible && device === focusDevice && !activeCloneDone
		const isSecondaryOriginal = focusOverlay?.secondary?.device === device
		return {
			opacity: isActiveOriginal || isSecondaryOriginal ? 0 : 1,
			x: 0,
			y: 0,
			scale: 1,
			transition: !isFocused && focusOverlay ? DEVICE_EXIT_TRANSITION : DEVICE_RETURN_TRANSITION
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
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={isFocused ? SCRIM_ENTER_TRANSITION : SCRIM_EXIT_TRANSITION}
								/>
							) : null}
						</AnimatePresence>,
						document.body
					)
				: null}
			{portalReady && focusOverlay
				? createPortal(
						<div className="landing-stage-focus-layer" aria-hidden>
							<AnimatePresence onExitComplete={handleActiveCloneExitComplete}>
								{isFocused ? (
									<motion.div
										key={`${stageId}-${focusOverlay.device}-focus`}
										className={clsx('landing-stage-focus-clone', `landing-stage-focus-clone--${focusOverlay.device}`)}
										style={
											{
												left: focusOverlay.from.left,
												top: focusOverlay.from.top,
												width: focusOverlay.from.width,
												height: focusOverlay.from.height
											} as CSSProperties
										}
										initial={{ x: 0, y: 0, scale: 1 }}
										animate={{
											x: focusOverlay.target.x,
											y: focusOverlay.target.y,
											scale: focusOverlay.target.scale,
											transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] }
										}}
										exit={{
											x: 0,
											y: 0,
											scale: 1,
											transition: { duration: 0.58, ease: [0.64, 0, 0.78, 0] }
										}}
									>
										{renderDeviceMockup(focusOverlay.device, '-focus-clone')}
									</motion.div>
								) : null}
							</AnimatePresence>
						</div>,
						document.body
					)
				: null}
			{portalReady && focusOverlay?.secondary
				? createPortal(
						<div className="landing-stage-focus-underlay" aria-hidden>
							<AnimatePresence onExitComplete={handleSecondaryCloneExitComplete}>
								{isFocused || (focusOverlay.secondary.delayReturn && !secondaryExitEnabled) ? (
									<motion.div
										key={`${stageId}-${focusOverlay.secondary.device}-secondary`}
										className={clsx(
											'landing-stage-focus-clone',
											'landing-stage-focus-clone--secondary',
											`landing-stage-focus-clone--${focusOverlay.secondary.device}`
										)}
										style={
											{
												left: focusOverlay.secondary.from.left,
												top: focusOverlay.secondary.from.top,
												width: focusOverlay.secondary.from.width,
												height: focusOverlay.secondary.from.height
											} as CSSProperties
										}
										initial={{ x: 0, y: 0, scale: 1 }}
										animate={{
											x: focusOverlay.secondary.target.x,
											y: focusOverlay.secondary.target.y,
											scale: focusOverlay.secondary.target.scale,
											transition: DEVICE_RETURN_TRANSITION
										}}
										exit={{
											x: 0,
											y: 0,
											scale: 1,
											transition: DEVICE_EXIT_TRANSITION
										}}
									>
										{renderDeviceMockup(focusOverlay.secondary.device, '-secondary-clone')}
									</motion.div>
								) : null}
							</AnimatePresence>
						</div>,
						document.body
					)
				: null}
			{debugReport ? <LandingStageDebugPanel text={debugReport} /> : null}
		</>
	)
}
