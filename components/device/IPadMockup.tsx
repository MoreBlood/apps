'use client'

import clsx from 'clsx'
import { IPadMockupFrame } from '@/components/mockups/IPadMockupFrame'
import { MOCKUP_IPAD, MOCKUP_SCREEN_IPAD, mockupScreenSlotStyle, resolveMockupSize } from '@/lib/device-mockup-sizes'
import type { IPadMockupProps } from '@/types/device-mockup'

/** iPad mockup (Figma frame). Screen content in HTML under the SVG bezel. */
export default function IPadMockup({
	instanceId,
	width,
	height,
	className,
	wrapperClassName,
	children,
	...rest
}: IPadMockupProps) {
	const size = resolveMockupSize(MOCKUP_IPAD, width, height)

	return (
		<div className={clsx('device-mockup', 'device-mockup--ipad', wrapperClassName)}>
			<div className="device-mockup__canvas">
				{children ? (
					<div className="device-mockup__screen" style={mockupScreenSlotStyle(MOCKUP_SCREEN_IPAD, MOCKUP_IPAD)}>
						{children}
					</div>
				) : null}
				<div className="device-mockup__frame">
					<IPadMockupFrame
						instanceId={instanceId}
						className={className}
						width="100%"
						height="100%"
						{...size}
						{...rest}
					/>
				</div>
			</div>
		</div>
	)
}
