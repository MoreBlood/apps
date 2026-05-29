'use client'

import type { KeyboardEvent, MouseEvent } from 'react'
import clsx from 'clsx'
import { DeviceScreen, IPadMockup, IPhoneMockup } from '@/components/device'
import { useLandingStageScale } from '@/hooks/useLandingStageScale'
import { getLandingStageScreenshots } from '@/lib/app-screenshot'
import { getLandingStageLayoutKey } from '@/lib/landing-stage-scale'
import { landingStageId } from '@/lib/landing-stage-tuner'
import type { LandingFeatureVisual } from '@/types/landing'
import LandingStageDebugPanel from './LandingStageDebugPanel'
import {
	createInitialOverride,
	useLandingStageTunerStage
} from './LandingStageTunerContext'

type Variant = 'hero' | 'compact' | LandingFeatureVisual

type Props = {
	appSlug: string
	appName: string
	variant?: Variant
	className?: string
}

export default function LandingDeviceStage({
	appSlug,
	appName,
	variant = 'hero',
	className
}: Props) {
	const stageId = landingStageId(appSlug, variant)
	const { tuner, enabled: tunerEnabled, isActive } = useLandingStageTunerStage(appSlug, variant)
	const { stageRef, debugReport } = useLandingStageScale(variant, { stageId })
	const { phone: phoneScreenshot, tablet: tabletScreenshot } = getLandingStageScreenshots(appSlug, variant)

	const handleStageClick = (e: MouseEvent | KeyboardEvent) => {
		e.stopPropagation()
		if (!tunerEnabled || !tuner?.enabled || !stageRef.current) return
		const { width } = stageRef.current.getBoundingClientRect()
		const layoutKey = getLandingStageLayoutKey(variant, width)
		const existing = tuner.getOverride(stageId)
		tuner.open(
			{ stageId, variant, layoutKey, appSlug },
			existing ?? createInitialOverride(layoutKey)
		)
	}

	return (
		<>
			<div
				ref={stageRef}
				className={clsx(
					'landing-stage',
					(variant === 'hero' || variant === 'compact') && `landing-stage--${variant}`,
					variant !== 'hero' && variant !== 'compact' && `landing-stage--${variant}`,
					tunerEnabled && 'landing-stage--tuner-target',
					isActive && 'landing-stage--tuner-active',
					className
				)}
				aria-hidden={!tunerEnabled}
				onClick={tunerEnabled ? handleStageClick : undefined}
				onKeyDown={
					tunerEnabled
						? (e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault()
									handleStageClick()
								}
							}
						: undefined
				}
				role={tunerEnabled ? 'button' : undefined}
				tabIndex={tunerEnabled ? 0 : undefined}
			>
			<div className="landing-stage__glow" />
			<div className="landing-stage__cluster">
				<div className="landing-stage__device landing-stage__device--ipad">
					<IPadMockup color="black" wrapperClassName="landing-stage__mockup">
						<DeviceScreen
							src={tabletScreenshot}
							alt={`${appName} on iPad`}
							className="landing-stage__screen landing-stage__screen--tablet"
						/>
					</IPadMockup>
				</div>
				<div className="landing-stage__device landing-stage__device--iphone">
					<IPhoneMockup wrapperClassName="landing-stage__mockup">
						<DeviceScreen
							src={phoneScreenshot}
							alt={`${appName} screenshot`}
							className="landing-stage__screen landing-stage__screen--phone"
						/>
					</IPhoneMockup>
				</div>
			</div>
			</div>
			{debugReport ? <LandingStageDebugPanel text={debugReport} /> : null}
		</>
	)
}
