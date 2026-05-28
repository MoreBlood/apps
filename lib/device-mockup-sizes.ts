import type { DeviceFramesetProps } from 'react-device-frameset'
import { DeviceOptions } from 'react-device-frameset'

/** Native `.marvel-device` dimensions from marvel-devices.css */
export const MOCKUP_IPAD = { w: 576, h: 768 } as const
export const MOCKUP_IPHONE = { w: 375, h: 812 } as const

/** Keep width/height in sync — never pass only one axis to the frameset. */
export function resolveDeviceFramesetSize(
	device: DeviceFramesetProps['device'],
	width?: number,
	height?: number
): Pick<DeviceFramesetProps, 'width' | 'height'> {
	if (width == null && height == null) {
		return {}
	}

	const native = DeviceOptions[device as keyof typeof DeviceOptions]
	if (!native) {
		return {
			...(width != null ? { width } : {}),
			...(height != null ? { height } : {})
		}
	}

	if (width != null && height != null) {
		return { width, height }
	}
	if (width != null) {
		return { width, height: Math.round((width / native.width) * native.height) }
	}
	return { width: Math.round((height! / native.height) * native.width), height: height! }
}
