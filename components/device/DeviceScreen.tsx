'use client'

import clsx from 'clsx'
import type { ReactNode, SyntheticEvent } from 'react'
import OptimizedImage from '@/components/shared/OptimizedImage'

type Props = {
	/** Screenshot path from config (may include basePath). */
	src?: string
	alt?: string
	className?: string
	children?: ReactNode
	priority?: boolean
	sizes?: string
	onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void
}

/**
 * Content slot for device mockups — optimized WebP + blur via next/image.
 */
export default function DeviceScreen({
	src,
	alt = '',
	className,
	children,
	priority = false,
	sizes = '(max-width: 1100px) 38vw, 320px',
	onLoad
}: Props) {
	if (src) {
		return (
			<OptimizedImage
				src={src}
				alt={alt}
				className={clsx('device-screen', 'device-screen--image', className)}
				imgClassName="device-screen__img"
				fill
				priority={priority}
				sizes={sizes}
				onLoad={onLoad}
			/>
		)
	}

	return <div className={clsx('device-screen', className)}>{children}</div>
}
