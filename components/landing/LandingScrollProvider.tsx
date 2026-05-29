'use client'

import Lenis from 'lenis'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import 'lenis/dist/lenis.css'

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
	return useContext(LenisContext)
}

type Props = {
	children: React.ReactNode
}

export default function LandingScrollProvider({ children }: Props) {
	const [lenis, setLenis] = useState<Lenis | null>(null)
	const lenisRef = useRef<Lenis | null>(null)

	useEffect(() => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (prefersReducedMotion) return

		const instance = new Lenis({
			duration: 1.15,
			easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
			smoothWheel: true,
			touchMultiplier: 1.1,
			autoRaf: true
		})

		lenisRef.current = instance
		setLenis(instance)

		return () => {
			instance.destroy()
			lenisRef.current = null
			setLenis(null)
		}
	}, [])

	return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
