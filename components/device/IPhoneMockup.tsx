'use client'

import DeviceMockup from './DeviceMockup'
import type { IPhoneMockupProps } from '@/types/device-mockup'

/**
 * iPhone mockup (notch frame). Omit `width`/`height` for native proportions; scale via CSS `transform`.
 */
export default function IPhoneMockup({
	landscape,
	width,
	height,
	zoom,
	className,
	wrapperClassName,
	children,
	...rest
}: IPhoneMockupProps) {
	return (
		<DeviceMockup
			device="iPhone X"
			landscape={landscape}
			width={width}
			height={height}
			zoom={zoom}
			className={className}
			wrapperClassName={wrapperClassName}
			{...rest}
		>
			{children}
		</DeviceMockup>
	)
}
