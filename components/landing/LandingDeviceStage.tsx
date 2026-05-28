import clsx from 'clsx'
import type { LandingFeatureVisual } from '@/types/landing'

type Variant = 'hero' | 'compact' | LandingFeatureVisual

type Props = {
	variant?: Variant
	className?: string
}

export default function LandingDeviceStage({ variant = 'hero', className }: Props) {
	return (
		<div
			className={clsx(
				'landing-stage',
				variant === 'hero' && 'landing-stage--hero',
				variant === 'compact' && 'landing-stage--compact',
				variant !== 'hero' && variant !== 'compact' && `landing-stage--${variant}`,
				className
			)}
			aria-hidden
		>
			<div className="landing-stage__glow" />
			<div className="landing-stage__tablet">
				<div className="landing-stage__screen landing-stage__screen--tablet" />
			</div>
			<div className="landing-stage__phone">
				<div className="landing-stage__screen landing-stage__screen--phone" />
				<div className="landing-stage__island" />
			</div>
			<div className="landing-stage__phone landing-stage__phone--secondary">
				<div className="landing-stage__screen landing-stage__screen--phone landing-stage__screen--alt" />
			</div>
		</div>
	)
}
