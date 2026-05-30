'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'

type LenisInstance = {
	scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => void
	destroy: () => void
}

const LenisContext = createContext<LenisInstance | null>(null)

export function useLenis() {
	return useContext(LenisContext)
}

type Props = {
	children: React.ReactNode
}

export default function LandingScrollProvider({ children }: Props) {
	const [lenis, setLenis] = useState<LenisInstance | null>(null)
	const lenisRef = useRef<LenisInstance | null>(null)

	useEffect(() => {
		const prefersReducedMotion = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (prefersReducedMotion) return

		let cancelled = false
		let instance: LenisInstance | null = null

		const start = () => {
			if (cancelled) return
			void import('lenis').then(({ default: Lenis }) => {
				if (cancelled) return
				instance = new Lenis({
					duration: 1.15,
					easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
					smoothWheel: true,
					touchMultiplier: 1.1,
					autoRaf: true
				}) as LenisInstance
				lenisRef.current = instance
				setLenis(instance)
			})
		}

		if (typeof requestIdleCallback === 'function') {
			const id = requestIdleCallback(start, { timeout: 2500 })
			return () => {
				cancelled = true
				cancelIdleCallback(id)
				instance?.destroy()
				lenisRef.current = null
				setLenis(null)
			}
		}

		const timer = globalThis.setTimeout(start, 1200)
		return () => {
			cancelled = true
			clearTimeout(timer)
			instance?.destroy()
			lenisRef.current = null
			setLenis(null)
		}
	}, [])

	return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
