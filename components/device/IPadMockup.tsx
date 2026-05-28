'use client'

import DeviceMockup from './DeviceMockup'
import type { IPadMockupProps } from '@/types/device-mockup'

/**
 * iPad mockup. Defaults to silver frame; pass `color="black"` for a dark bezel.
 */
export default function IPadMockup({
	color = 'silver',
	landscape,
	width,
	height,
	zoom,
	className,
	wrapperClassName,
	children,
	...rest
}: IPadMockupProps) {
	return (
		<DeviceMockup
			device="iPad Mini"
			color={color}
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
