import type { DeviceFramesetProps } from 'react-device-frameset'
import type { ReactNode } from 'react'

/** Shared layout props for local device mockup wrappers. */
export type DeviceMockupShellProps = {
	/** Applied to the outer `.device-mockup` wrapper. */
	wrapperClassName?: string
	className?: string
	children?: ReactNode
}

export type IPhoneMockupProps = Omit<Extract<DeviceFramesetProps, { device: 'iPhone X' }>, 'device'> &
	DeviceMockupShellProps

export type IPadMockupProps = Omit<Extract<DeviceFramesetProps, { device: 'iPad Mini' }>, 'device'> &
	DeviceMockupShellProps

export type MacbookMockupProps = Omit<Extract<DeviceFramesetProps, { device: 'MacBook Pro' }>, 'device'> &
	DeviceMockupShellProps
