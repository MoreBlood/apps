'use client'

import clsx from 'clsx'
import type { SVGProps } from 'react'
import { stableDomId } from '@/lib/stable-dom-id'

export type IPadMockupFrameProps = SVGProps<SVGSVGElement> & {
	instanceId: string
}

/** Figma device bezel (SVG only). Screen content sits in `.device-mockup__screen` under this layer. */
export function IPadMockupFrame({ className, instanceId, ...props }: IPadMockupFrameProps) {
	const uid = stableDomId(instanceId, 'ipad-frame')
	return (
		<svg
			viewBox="0 0 1415 2048"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			preserveAspectRatio="xMidYMid meet"
			className={clsx('device-mockup-frame', className)}
			role="presentation"
			{...props}
		>
			<path
				d="M1281.94 4.42773C1355.3 4.42783 1414.78 63.9035 1414.78 137.271V1915.16C1414.78 1988.52 1355.3 2048 1281.94 2048H132.843C59.4757 2048 0 1988.52 0 1915.16V137.271C0 63.9043 59.4757 4.42798 132.843 4.42773H1281.94ZM139.64 104C119.957 104 104 119.957 104 139.64V1916.36C104 1936.04 119.957 1952 139.64 1952H1272.36C1292.04 1952 1308 1936.04 1308 1916.36V139.64C1308 119.957 1292.04 104 1272.36 104H139.64Z"
				fill="#D9D9D9"
			/>
			<path
				d="M1277.51 17.7119C1345.98 17.7119 1401.5 73.2231 1401.5 141.699V1910.73C1401.5 1979.2 1345.98 2034.71 1277.51 2034.71H137.271C68.7955 2034.71 13.2844 1979.2 13.2842 1910.73V141.699C13.2842 73.2231 68.7953 17.7119 137.271 17.7119H1277.51ZM139.64 104C119.957 104 104 119.957 104 139.64V1916.36C104 1936.04 119.957 1952 139.64 1952H1272.36C1292.04 1952 1308 1936.04 1308 1916.36V139.64C1308 119.957 1292.04 104 1272.36 104H139.64Z"
				fill="#000002"
			/>
			<circle cx="708.498" cy="50.9234" r="17.7124" fill="#10130F" />
			<g>
				<ellipse cx="708.497" cy="50.9232" rx="11.0703" ry="15.4984" fill="#0C0D16" />
			</g>
			<g>
				<ellipse cx="708.497" cy="50.9234" rx="4.42811" ry="6.64216" fill="#515266" />
			</g>
			<g>
				<ellipse cx="708.498" cy="44.2816" rx="6.64216" ry="4.42811" fill="#101012" />
			</g>
			<g>
				<ellipse cx="708.498" cy="59.7795" rx="6.64216" ry="2.21405" fill="#101012" />
			</g>
			<g>
				<circle cx="706.283" cy="50.923" r="2.21405" fill="#515266" />
			</g>
			<g>
				<ellipse cx="711.818" cy="50.923" rx="1.10703" ry="2.21405" fill="#5C5F73" />
			</g>
			<mask
				id={`${uid}-mask0_4343_11433`}
				style={{ maskType: 'alpha' }}
				maskUnits="userSpaceOnUse"
				x="139"
				y="0"
				width="101"
				height="7"
			>
				<path
					d="M139.484 4.42811C139.484 1.98253 141.467 0 143.912 0H234.689C237.134 0 239.117 1.98253 239.117 4.42811V6.64216H139.484V4.42811Z"
					fill="#F1EDE5"
				/>
			</mask>
			<g mask={`url(#${uid}-mask0_4343_11433)`}>
				<g>
					<path
						d="M139.484 4.42811C139.484 1.98253 141.467 0 143.912 0H234.689C237.134 0 239.117 1.98253 239.117 4.42811V6.64216H139.484V4.42811Z"
						fill="#B1B4B7"
					/>
				</g>
				<g>
					<rect x="139.484" width="13.2843" height="6.64216" fill="black" fillOpacity="0.4" />
				</g>
				<g>
					<rect x="139.484" width="4.42811" height="6.64216" fill="black" fillOpacity="0.4" />
				</g>
				<g>
					<rect x="225.833" width="13.2843" height="6.64216" fill="black" fillOpacity="0.4" />
				</g>
				<g>
					<rect x="234.689" width="4.42811" height="6.64216" fill="black" fillOpacity="0.4" />
				</g>
			</g>
			<mask
				id={`${uid}-mask1_4343_11433`}
				style={{ maskType: 'alpha' }}
				maskUnits="userSpaceOnUse"
				x="261"
				y="0"
				width="100"
				height="7"
			>
				<path
					d="M261.259 4.42811C261.259 1.98253 263.241 0 265.687 0H356.463C358.909 0 360.891 1.98253 360.891 4.42811V6.64216H261.259V4.42811Z"
					fill="#F1EDE5"
				/>
			</mask>
			<g mask={`url(#${uid}-mask1_4343_11433)`}>
				<g>
					<path
						d="M261.259 4.42811C261.259 1.98253 263.241 0 265.687 0H356.463C358.909 0 360.891 1.98253 360.891 4.42811V6.64216H261.259V4.42811Z"
						fill="#B1B4B7"
					/>
				</g>
				<g>
					<rect x="261.259" width="13.2843" height="6.64216" fill="black" fillOpacity="0.4" />
				</g>
				<g>
					<rect x="261.259" width="4.42811" height="6.64216" fill="black" fillOpacity="0.4" />
				</g>
				<g>
					<rect x="347.606" width="13.2843" height="6.64216" fill="black" fillOpacity="0.4" />
				</g>
				<g>
					<rect x="356.463" width="4.42811" height="6.64216" fill="black" fillOpacity="0.4" />
				</g>
			</g>
			<mask
				id={`${uid}-mask2_4343_11433`}
				style={{ maskType: 'alpha' }}
				maskUnits="userSpaceOnUse"
				x="1098"
				y="0"
				width="169"
				height="7"
			>
				<path
					d="M1098.17 4.42811C1098.17 1.98253 1100.15 0 1102.6 0H1262.01C1264.46 0 1266.44 1.98253 1266.44 4.42811V6.64216H1098.17V4.42811Z"
					fill="#F1EDE5"
				/>
			</mask>
			<g mask={`url(#${uid}-mask2_4343_11433)`}>
				<g>
					<path
						d="M1098.17 4.42811C1098.17 1.98253 1100.15 0 1102.6 0H1262.01C1264.46 0 1266.44 1.98253 1266.44 4.42811V6.64216H1098.17V4.42811Z"
						fill="#B1B4B7"
					/>
				</g>
				<g>
					<rect x="1098.17" width="17.7124" height="6.64216" fill="black" fillOpacity="0.4" />
				</g>
				<g>
					<rect x="1098.17" width="6.64216" height="6.64216" fill="black" fillOpacity="0.4" />
				</g>
				<g>
					<rect x="1248.73" width="17.7124" height="6.64216" fill="black" fillOpacity="0.4" />
				</g>
				<g>
					<rect x="1259.8" width="6.64216" height="6.64216" fill="black" fillOpacity="0.4" />
				</g>
			</g>
		</svg>
	)
}
