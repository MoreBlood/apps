'use client'

import clsx from 'clsx'
import { IPhoneMockupFrame } from '@/components/mockups/IPhoneMockupFrame'
import { MOCKUP_IPHONE, resolveMockupSize } from '@/lib/device-mockup-sizes'
import type { IPhoneMockupProps } from '@/types/device-mockup'

/**
 * iPhone mockup (Figma frame). Omit `width`/`height` to fill the parent; scale via CSS `transform`.
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
			<IPhoneMockupFrame instanceId={instanceId} className={className} width="100%" height="100%" {...size} {...rest}>
				{children}
			</IPhoneMockupFrame>
		</div>
	)
}
