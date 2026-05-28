'use client'

import clsx from 'clsx'
import { DeviceFrameset, type DeviceFramesetProps } from 'react-device-frameset'
import { resolveDeviceFramesetSize } from '@/lib/device-mockup-sizes'

export type DeviceMockupProps = DeviceFramesetProps & {
	/** Wrapper around the frameset (layout, max-width, centering). */
	wrapperClassName?: string
}

/**
 * Base mockup — passes props through to `react-device-frameset` with project styling.
 */
export default function DeviceMockup({
	wrapperClassName,
	className,
	children,
	device,
	width,
	height,
	zoom,
	...rest
}: DeviceMockupProps) {
	const size = resolveDeviceFramesetSize(device, width, height)

	return (
		<div className={clsx('device-mockup', wrapperClassName, className)}>
			<DeviceFrameset device={device} zoom={zoom} {...size} {...rest}>
				{children}
			</DeviceFrameset>
		</div>
	)
}
