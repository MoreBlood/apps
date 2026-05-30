'use client'

import { type ComponentType, useEffect, useRef, useState } from 'react'
import { LANDING_LOAD_POLICIES, type LandingLoadTier } from '@/lib/landing-performance'

type Props<P extends object> = {
	tier: LandingLoadTier
	load: () => Promise<{ default: ComponentType<P> }>
	props: P
	minHeight?: string
	className?: string
}

/**
 * Code-split section with tier-aware mount timing (eager / viewport / idle).
 */
export default function LandingLazySection<P extends object>({ tier, load, props, minHeight, className }: Props<P>) {
	const policy = LANDING_LOAD_POLICIES[tier]
	const deferViewport = tier === 'viewport'
	const viewportRef = useRef<HTMLDivElement>(null)
	const [inViewport, setInViewport] = useState(!deferViewport)
	const [Component, setComponent] = useState<ComponentType<P> | null>(null)
	const [idleGateOpen, setIdleGateOpen] = useState(tier !== 'idle')

	useEffect(() => {
		if (!deferViewport) return
		const node = viewportRef.current
		if (!node) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInViewport(true)
					observer.disconnect()
				}
			},
			{ rootMargin: policy.rootMargin, threshold: 0.01 }
		)
		observer.observe(node)
		return () => observer.disconnect()
	}, [deferViewport, policy.rootMargin])

	const canFetch =
		tier === 'eager' || tier === 'critical'
			? true
			: tier === 'viewport'
				? inViewport
				: tier === 'idle'
					? idleGateOpen
					: false

	useEffect(() => {
		if (tier !== 'idle' || idleGateOpen) return
		const open = () => setIdleGateOpen(true)
		if (typeof requestIdleCallback === 'function') {
			const id = requestIdleCallback(open, { timeout: policy.idleTimeoutMs ?? 2500 })
			return () => cancelIdleCallback(id)
		}
		const t = globalThis.setTimeout(open, 1200)
		return () => clearTimeout(t)
	}, [idleGateOpen, policy.idleTimeoutMs, tier])

	useEffect(() => {
		if (!canFetch || Component) return
		void load().then((mod) => setComponent(() => mod.default))
	}, [canFetch, Component, load])

	return (
		<div
			ref={deferViewport ? viewportRef : undefined}
			className={className}
			style={!Component && minHeight ? { minHeight } : undefined}
			aria-hidden={!Component ? true : undefined}
		>
			{Component ? <Component {...props} /> : null}
		</div>
	)
}
