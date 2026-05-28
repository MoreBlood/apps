'use client'

import DeviceMockup from './DeviceMockup'
import type { MacbookMockupProps } from '@/types/device-mockup'

/** MacBook Pro mockup (no landscape variant in the library). */
export default function MacbookMockup({
	width,
	height,
	zoom,
	className,
	wrapperClassName,
	children,
	...rest
}: MacbookMockupProps) {
	return (
		<DeviceMockup
			device="MacBook Pro"
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
