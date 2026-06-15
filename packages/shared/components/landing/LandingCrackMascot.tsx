'use client'

import clsx from 'clsx'
import { useCallback, useEffect, useId, useState } from 'react'
import { getLandingCrackMascotTips } from '@/config/landing-crack-content'
import { getLandingCrackMacCopy, getLandingCrackMacMascotTips } from '@/config/landing-crack-mac'
import { assetPath } from '@/lib/basePath'
import type { LandingCrackSkin } from '@/lib/landing-crack-skin'

const TIP_INTERVAL_MS = 9000
/** Vertical sprite — see scripts/export-clippy-sprite.mjs */
const CLIPPY_SPRITE = assetPath('/clippy-clippit-sprite.png')

type Props = {
	appSlug: string
	skin?: LandingCrackSkin
}

export default function LandingCrackMascot({ appSlug, skin = 'win' }: Props) {
	const isMac = skin === 'mac'
	const macCopy = getLandingCrackMacCopy()
	const tips = isMac ? getLandingCrackMacMascotTips(appSlug) : getLandingCrackMascotTips(appSlug)
	const bubbleTitleId = useId()
	const [tipIndex, setTipIndex] = useState(0)
	const [open, setOpen] = useState(true)
	const [wiggle, setWiggle] = useState(false)

	const nextTip = useCallback(() => {
		setTipIndex((i) => (i + 1) % tips.length)
		setWiggle(true)
	}, [tips.length])

	useEffect(() => {
		if (!open || tips.length <= 1) return
		const timer = globalThis.setInterval(nextTip, TIP_INTERVAL_MS)
		return () => globalThis.clearInterval(timer)
	}, [nextTip, open, tips.length])

	useEffect(() => {
		if (!wiggle) return
		const t = globalThis.setTimeout(() => setWiggle(false), 520)
		return () => clearTimeout(t)
	}, [wiggle])

	if (tips.length === 0) return null

	const mascotLabel = isMac ? macCopy.mascotAria : 'Скобка (Clippy) — помощник'
	const bubbleTitle = isMac ? macCopy.mascotTitle : 'Скобка'
	const nextLabel = isMac ? macCopy.mascotNextLabel : 'Ещё совет'

	return (
		<aside className={clsx('landing-crack-mascot', isMac && 'landing-crack-mascot--mac')} aria-label={mascotLabel}>
			{open && (
				<div className="landing-crack-mascot__bubble-wrap">
					<div className="landing-crack-mascot__bubble-tail" aria-hidden />
					<section className="landing-crack-mascot__bubble" aria-labelledby={bubbleTitleId}>
						<div className="landing-crack-mascot__bubble-titlebar">
							<span id={bubbleTitleId}>{bubbleTitle}</span>
							<button
								type="button"
								className="landing-crack-mascot__bubble-close"
								aria-label="Скрыть совет"
								onClick={() => setOpen(false)}
							>
								×
							</button>
						</div>
						<p className="landing-crack-mascot__tip">{tips[tipIndex]}</p>
						<div className="landing-crack-mascot__bubble-actions">
							<button type="button" className="landing-crack-mascot__btn" onClick={nextTip}>
								{nextLabel}
							</button>
						</div>
					</section>
				</div>
			)}

			<button
				type="button"
				className={`landing-crack-mascot__body${wiggle ? ' landing-crack-mascot__body--wiggle' : ''}`}
				aria-label={open ? mascotLabel : isMac ? 'Show Macintosh Guide' : 'Показать Скобку'}
				onClick={() => {
					if (!open) setOpen(true)
					else nextTip()
				}}
			>
				{!isMac && (
					<span className="landing-crack-mascot__clippy-viewport" role="img" aria-hidden>
						{/* biome-ignore lint/performance/noImgElement: sprite sheet strip */}
						<img className="landing-crack-mascot__clippy-strip" src={CLIPPY_SPRITE} alt="" width={220} height={9568} />
					</span>
				)}
				<span className="landing-crack-mascot__name">{isMac ? macCopy.mascotTitle : 'Скобка'}</span>
			</button>
		</aside>
	)
}
