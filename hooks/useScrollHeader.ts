'use client'

import { useEffect, useRef, useState } from 'react'

type Options = {
	/** Scroll offset where hide animation starts. */
	topThreshold?: number
	/** Scroll offset where the header is fully hidden. */
	hideAfter?: number
	disabled?: boolean
}

function hideProgressForY(y: number, topThreshold: number, hideAfter: number, snap: boolean): number {
	if (y <= topThreshold) return 0

	const range = hideAfter - topThreshold
	if (range <= 0) return y > topThreshold ? 1 : 0

	const linear = Math.min(1, Math.max(0, (y - topThreshold) / range))
	return snap ? (linear >= 1 ? 1 : 0) : linear
}

export function useScrollHeader({ topThreshold = 8, hideAfter = 80, disabled = false }: Options = {}) {
	const [hideProgress, setHideProgress] = useState(0)
	const rafId = useRef(0)

	useEffect(() => {
		// Freeze hide progress while disabled (e.g. mobile menu open). Resetting to 0
		// would slide the fixed bar back in and shift the page behind the overlay.
		if (disabled) {
			return
		}

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

		const update = () => {
			const y = window.scrollY
			setHideProgress(hideProgressForY(y, topThreshold, hideAfter, reducedMotion.matches))
		}

		const onScroll = () => {
			cancelAnimationFrame(rafId.current)
			rafId.current = requestAnimationFrame(update)
		}

		window.addEventListener('scroll', onScroll, { passive: true })
		update()

		return () => {
			window.removeEventListener('scroll', onScroll)
			cancelAnimationFrame(rafId.current)
		}
	}, [topThreshold, hideAfter, disabled])

	return {
		hideProgress,
		visible: hideProgress < 1
	}
}
