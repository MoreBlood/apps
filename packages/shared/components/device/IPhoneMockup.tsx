'use client'

import clsx from 'clsx'
import { IPhoneMockupFrame } from '@/components/mockups/IPhoneMockupFrame'
import {
	MOCKUP_IPHONE,
	MOCKUP_SCREEN_IPHONE,
	mockupScreenSlotStyle,
	resolveMockupSize
} from '@/lib/device-mockup-sizes'
import type { IPhoneMockupProps } from '@/types/device-mockup'

/**
 * iPhone mockup (Figma frame). Omit `width`/`height` to fill the parent; scale via CSS `transform`.
 * Screen content renders in HTML under the SVG bezel (lighter in Safari than foreignObject).
 */
export default function IPhoneMockup({
	instanceId,
	width,
	height,
	className,
	wrapperClassName,
	children,
	...rest
}: IPhoneMockupProps) {
	const size = resolveMockupSize(MOCKUP_IPHONE, width, height)

	return (
		<div className={clsx('device-mockup', 'device-mockup--iphone', wrapperClassName)}>
			<div className="device-mockup__canvas">
				{children ? (
					<div className="device-mockup__screen" style={mockupScreenSlotStyle(MOCKUP_SCREEN_IPHONE, MOCKUP_IPHONE)}>
						{children}
					</div>
				) : null}
				<div className="device-mockup__frame">
					<IPhoneMockupFrame
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
