'use client'

import type { KeyboardEvent, MouseEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useLenis } from '@/components/landing/LandingScrollProvider'

export type LandingStageFocusDevice = 'ipad' | 'iphone'

export const LANDING_STAGE_FOCUS_EVENT = 'landing-stage-focus-change'

type FocusChangeDetail = {
	stageId: string
	device: LandingStageFocusDevice | null
}

type Options = {
	stageId: string
	/** When true, device focus is disabled (e.g. stage tuner). */
	disabled?: boolean
}

export function useLandingStageFocus({ stageId, disabled = false }: Options) {
	const [focusedDevice, setFocusedDevice] = useState<LandingStageFocusDevice | null>(null)
	const lenis = useLenis()
	const isFocused = focusedDevice != null && !disabled

	const clearFocus = useCallback(() => {
		setFocusedDevice(null)
	}, [])

	const publishFocus = useCallback(
		(device: LandingStageFocusDevice | null) => {
			if (typeof window === 'undefined') return
			window.dispatchEvent(
				new CustomEvent<FocusChangeDetail>(LANDING_STAGE_FOCUS_EVENT, {
					detail: { stageId, device }
				})
			)
		},
		[stageId]
	)

	const setFocus = useCallback(
		(device: LandingStageFocusDevice | null) => {
			if (disabled) return
			setFocusedDevice(device)
			publishFocus(device)
		},
		[disabled, publishFocus]
	)

	const onDeviceClick = useCallback(
		(device: LandingStageFocusDevice, e: MouseEvent | KeyboardEvent) => {
			if (disabled) return
			e.stopPropagation()
			setFocus(focusedDevice === device ? null : device)
		},
		[disabled, focusedDevice, setFocus]
	)

	const onDeviceKeyDown = useCallback(
		(device: LandingStageFocusDevice, e: KeyboardEvent) => {
			if (disabled) return
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault()
				onDeviceClick(device, e)
			}
		},
		[disabled, onDeviceClick]
	)

	const onScrimClick = useCallback(() => {
		setFocus(null)
	}, [setFocus])

	useEffect(() => {
		if (disabled && focusedDevice != null) {
			setFocusedDevice(null)
		}
	}, [disabled, focusedDevice])

	useEffect(() => {
		const onOtherStageFocus = (e: Event) => {
			const detail = (e as CustomEvent<FocusChangeDetail>).detail
			if (detail?.stageId !== stageId && detail?.device != null) {
				setFocusedDevice(null)
			}
		}
		window.addEventListener(LANDING_STAGE_FOCUS_EVENT, onOtherStageFocus)
		return () => window.removeEventListener(LANDING_STAGE_FOCUS_EVENT, onOtherStageFocus)
	}, [stageId])

	useEffect(() => {
		if (!isFocused) return
		const onEscape = (e: globalThis.KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault()
				setFocus(null)
			}
		}
		window.addEventListener('keydown', onEscape)
		return () => window.removeEventListener('keydown', onEscape)
	}, [isFocused, setFocus])

	useEffect(() => {
		if (typeof document === 'undefined') return
		const root = document.documentElement
		document.body.classList.toggle('landing-stage-focus-open', isFocused)
		root.classList.toggle('landing-stage-focus-open', isFocused)
		if (isFocused) {
			lenis?.stop()
		} else {
			lenis?.start()
		}
		return () => {
			document.body.classList.remove('landing-stage-focus-open')
			root.classList.remove('landing-stage-focus-open')
			lenis?.start()
		}
	}, [isFocused, lenis])

	return {
		focusedDevice: disabled ? null : focusedDevice,
		isFocused,
		onDeviceClick,
		onDeviceKeyDown,
		onScrimClick,
		clearFocus
	}
}
