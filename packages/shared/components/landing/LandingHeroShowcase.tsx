'use client'

import { useLayoutEffect, useRef } from 'react'
import { isLandingStageSizeLog, logLandingStageSize } from '@/lib/landing-stage-size-log'
import { landingStageId } from '@/lib/landing-stage-tuner'
import LandingDeviceStage from './LandingDeviceStage'

type Props = {
	appSlug: string
	appName: string
}

/** Hero device mockups — stage fills the showcase region (LCP-critical path). */
export default function LandingHeroShowcase({ appSlug, appName }: Props) {
	const loggedRef = useRef(false)

	useLayoutEffect(() => {
		if (!isLandingStageSizeLog() || loggedRef.current) return
		const el = document.querySelector<HTMLElement>('.landing-hero__showcase .landing-hero__stage')
		if (!el) return
		loggedRef.current = true
		logLandingStageSize(el, {
			reason: 'hero-hydrate',
			variant: 'hero',
			stageId: landingStageId(appSlug, 'hero')
		})
	}, [appSlug])

	return <LandingDeviceStage appSlug={appSlug} appName={appName} variant="hero" className="landing-hero__stage" />
}
