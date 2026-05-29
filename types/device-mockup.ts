import type { ReactNode, SVGProps } from 'react'

/** Shared layout props for device mockup wrappers. */
export type DeviceMockupShellProps = {
	/** Applied to the outer `.device-mockup` wrapper. */
	wrapperClassName?: string
	className?: string
	children?: ReactNode
	width?: number
	height?: number
}

export type IPhoneMockupProps = DeviceMockupShellProps & Omit<SVGProps<SVGSVGElement>, 'children'>

export type IPadMockupProps = DeviceMockupShellProps & Omit<SVGProps<SVGSVGElement>, 'children'>
