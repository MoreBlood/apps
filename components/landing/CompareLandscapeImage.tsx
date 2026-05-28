'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { assetPath } from '@/lib/basePath'
import { getCompareImageMeta, type CompareImageMeta } from '@/lib/compare-image-meta'

function panEndShift(meta: CompareImageMeta, frameAspect: number): string {
	const imgAspect = meta.width / meta.height
	const widthRatio = imgAspect / frameAspect
	if (widthRatio <= 1) return '0'
	const shift = (1 - 1 / widthRatio) * 100
	return `-${shift.toFixed(2)}%`
}

function useCompareFrameAspect() {
	const viewportRef = useRef<HTMLDivElement>(null)
	const [frameAspect, setFrameAspect] = useState(4 / 5)

	useEffect(() => {
		const frame = viewportRef.current?.closest('.landing-photo__frame')
		if (!frame) return

		const update = () => {
			const { clientWidth: w, clientHeight: h } = frame
			if (h > 0) setFrameAspect(w / h)
		}

		update()
		const observer = new ResizeObserver(update)
		observer.observe(frame)
		return () => observer.disconnect()
	}, [])

	return { viewportRef, frameAspect }
}

type Props = {
	src: string
	blurDataURL: string
	alt: string
	isActive: boolean
	priority?: boolean
}

export default function CompareLandscapeImage({
	src,
	blurDataURL,
	alt,
	isActive,
	priority = false
}: Props) {
	const { viewportRef, frameAspect } = useCompareFrameAspect()
	const meta = getCompareImageMeta(src)
	const width = meta?.width ?? 1600
	const height = meta?.height ?? 1200
	const panEnd = meta != null ? panEndShift(meta, frameAspect) : '0'

	return (
		<div ref={viewportRef} className="landing-compare__pan-viewport">
			<div
				className={clsx(
					'landing-compare__pan-track',
					isActive && 'landing-compare__pan-track--active'
				)}
				style={{ '--compare-pan-end': panEnd } as React.CSSProperties}
			>
				<Image
					src={assetPath(src)}
					alt={isActive ? alt : ''}
					width={width}
					height={height}
					sizes="(max-width: 900px) 100vw, 50vw"
					className="landing-compare__pan-img"
					placeholder="blur"
					blurDataURL={blurDataURL}
					priority={priority}
					draggable={false}
				/>
			</div>
		</div>
	)
}
