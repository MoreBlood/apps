'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { type CompareImageMeta, getCompareImageMeta } from '@/lib/compare-image-meta'
import { resolveOptimizedImage } from '@/lib/optimized-image'

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

export default function CompareLandscapeImage({ src, blurDataURL, alt, isActive, priority = false }: Props) {
	const { viewportRef, frameAspect } = useCompareFrameAspect()
	const [documentVisible, setDocumentVisible] = useState(
		() => typeof document === 'undefined' || document.visibilityState === 'visible'
	)
	const optimized = resolveOptimizedImage(src)
	const meta = getCompareImageMeta(src)
	const width = meta?.width ?? optimized.width
	const height = meta?.height ?? optimized.height
	const panEnd = meta != null ? panEndShift(meta, frameAspect) : '0'
	const panRunning = isActive && documentVisible

	useEffect(() => {
		const onVisibility = () => setDocumentVisible(document.visibilityState === 'visible')
		document.addEventListener('visibilitychange', onVisibility)
		return () => document.removeEventListener('visibilitychange', onVisibility)
	}, [])

	return (
		<div ref={viewportRef} className="landing-compare__pan-viewport">
			<div
				className={clsx('landing-compare__pan-track', panRunning && 'landing-compare__pan-track--active')}
				style={{ '--compare-pan-end': panEnd } as React.CSSProperties}
			>
				<Image
					src={optimized.src}
					alt={isActive ? alt : ''}
					width={width}
					height={height}
					sizes="(max-width: 900px) 100vw, 50vw"
					className="landing-compare__pan-img"
					placeholder="blur"
					blurDataURL={blurDataURL}
					priority={priority}
					loading={priority ? undefined : 'lazy'}
					draggable={false}
				/>
			</div>
		</div>
	)
}
