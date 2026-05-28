'use client'

import clsx from 'clsx'
import type { ReactNode } from 'react'

type Props = {
	/** Screenshot or marketing image inside the device screen. */
	src?: string
	alt?: string
	className?: string
	children?: ReactNode
}

/**
 * Content slot for device mockups — image, gradient placeholder, or custom UI.
 */
export default function DeviceScreen({ src, alt = '', className, children }: Props) {
	if (src) {
		return (
			// biome-ignore lint/performance/noImgElement: static export; screenshots are local or CDN URLs
			<img src={src} alt={alt} className={clsx('device-screen', 'device-screen--image', className)} />
		)
	}

	return <div className={clsx('device-screen', className)}>{children}</div>
}
