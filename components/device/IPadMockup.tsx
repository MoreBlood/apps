'use client'

import clsx from 'clsx'
import { IPadMockupFrame } from '@/components/mockups/IPadMockupFrame'
import { MOCKUP_IPAD, resolveMockupSize } from '@/lib/device-mockup-sizes'
import type { IPadMockupProps } from '@/types/device-mockup'

/** iPad mockup (Figma frame). */
export default function IPadMockup({
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
			<IPadMockupFrame className={className} width="100%" height="100%" {...size} {...rest}>
				{children}
			</IPadMockupFrame>
		</div>
	)
}
