'use client'

import clsx from 'clsx'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react'
import type { LandingAppInfo } from '@/config'
import { getLandingAbAntiCopy } from '@/config/landing-ab-content'
import { type LandingAbVariant, resolveLandingAbVariant } from '@/lib/landing-ab'
import { scrollLandingAbToTop, setLandingAbMinimalScrollLock } from '@/lib/landing-ab-scroll'
import { setLandingCrackChrome } from '@/lib/landing-crack-chrome'
import { LANDING_CRACK_SKIN_QUERY, type LandingCrackSkin, resolveLandingCrackSkin } from '@/lib/landing-crack-skin'
import LandingAntiMinimal from './LandingAntiMinimal'
import { useLenis } from './LandingScrollProvider'

type Phase = 'intro' | 'interrupt' | 'minimal'

type Props = {
	app: LandingAppInfo
	children: ReactNode
}

const INTRO_MS = 2800
const SCROLL_TRIGGER_PX = 120

export default function LandingAbExperiment({ app, children }: Props) {
	const interruptTitleId = useId()
	const reducedMotion = useReducedMotion()
	const [variant, setVariant] = useState<LandingAbVariant | null>(null)
	const [skin, setSkin] = useState<LandingCrackSkin>('win')
	const [phase, setPhase] = useState<Phase>('intro')
	const triggeredRef = useRef(false)
	const lenis = useLenis()
	const copy = getLandingAbAntiCopy(app.slug)

	const resetScroll = useCallback(
		(smooth?: boolean) => {
			scrollLandingAbToTop({ lenis, smooth: smooth && !reducedMotion })
		},
		[lenis, reducedMotion]
	)

	const goMinimal = useCallback(() => {
		setPhase('minimal')
		resetScroll(!reducedMotion)
	}, [reducedMotion, resetScroll])

	const triggerInterrupt = useCallback(() => {
		if (triggeredRef.current || variant !== 'anti') return
		triggeredRef.current = true
		setPhase(reducedMotion ? 'minimal' : 'interrupt')
	}, [reducedMotion, variant])

	useEffect(() => {
		const params = new URLSearchParams(globalThis.location.search)
		setVariant(resolveLandingAbVariant(params.get('landing_ab')))
		setSkin(resolveLandingCrackSkin(params.get(LANDING_CRACK_SKIN_QUERY)))
	}, [])

	useEffect(() => {
		if (variant !== 'anti' || phase !== 'intro') return

		const t = globalThis.setTimeout(triggerInterrupt, INTRO_MS)

		const onScroll = () => {
			if (globalThis.scrollY >= SCROLL_TRIGGER_PX) triggerInterrupt()
		}
		globalThis.addEventListener('scroll', onScroll, { passive: true })

		return () => {
			clearTimeout(t)
			globalThis.removeEventListener('scroll', onScroll)
		}
	}, [phase, triggerInterrupt, variant])

	useEffect(() => {
		const active = variant === 'anti' && phase === 'minimal'
		setLandingCrackChrome(active, skin)
		return () => setLandingCrackChrome(false)
	}, [phase, skin, variant])

	useEffect(() => {
		if (variant !== 'anti') return

		const lock = phase === 'minimal'
		setLandingAbMinimalScrollLock(lock)
		if (lock) lenis?.stop()
		else lenis?.start()

		return () => {
			setLandingAbMinimalScrollLock(false)
			lenis?.start()
		}
	}, [lenis, phase, variant])

	useEffect(() => {
		if (variant !== 'anti') return
		if (phase !== 'minimal' && phase !== 'interrupt') return

		resetScroll(false)
		const raf = globalThis.requestAnimationFrame(() => resetScroll(false))
		const t = globalThis.setTimeout(() => resetScroll(false), 50)

		return () => {
			globalThis.cancelAnimationFrame(raf)
			globalThis.clearTimeout(t)
		}
	}, [phase, resetScroll, variant])

	useEffect(() => {
		if (phase !== 'interrupt') return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') goMinimal()
		}
		globalThis.addEventListener('keydown', onKey)
		return () => globalThis.removeEventListener('keydown', onKey)
	}, [goMinimal, phase])

	if (variant === null || variant === 'control' || !copy) {
		return <>{children}</>
	}

	const showPremium = phase === 'intro' || phase === 'interrupt'

	return (
		<div
			className={clsx('landing-ab', phase === 'minimal' && 'landing-ab--minimal')}
			data-landing-ab={variant}
			data-landing-ab-phase={phase}
			data-landing-crack-skin={phase === 'minimal' ? skin : undefined}
		>
			<div
				className={clsx('landing-ab__premium', !showPremium && 'landing-ab__premium--hidden')}
				aria-hidden={!showPremium}
			>
				{children}
			</div>

			<AnimatePresence>
				{phase === 'interrupt' && (
					<motion.div
						className="landing-ab-interrupt"
						role="dialog"
						aria-modal="true"
						aria-labelledby={interruptTitleId}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: reducedMotion ? 0 : 0.35 }}
					>
						<div className="landing-ab-interrupt__panel">
							<p className="landing-ab-interrupt__kicker">Fourth-wall break · industry satire</p>
							<h2 className="landing-ab-interrupt__title" id={interruptTitleId}>
								{copy.interruptTitle}
							</h2>
							<p className="landing-ab-interrupt__lead">{copy.interruptLead}</p>
							<div className="landing-ab-interrupt__actions">
								<button type="button" className="landing-ab-interrupt__primary" onClick={goMinimal}>
									{skin === 'mac' ? 'Continue — Open Honest Edition.pkg' : '[ OK ] Run keygen.exe (honest page)'}
								</button>
								<button
									type="button"
									className="landing-ab-interrupt__ghost"
									onClick={() => {
										triggeredRef.current = false
										setPhase('intro')
									}}
								>
									No wait, I love premium scroll experiences
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{phase === 'minimal' && <LandingAntiMinimal app={app} skin={skin} />}
		</div>
	)
}
