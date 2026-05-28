'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { useReducedMotion } from 'framer-motion'
import type { ComparePair } from '@/config/compare-content'
import { assetPath } from '@/lib/basePath'
import { getCompareImageBlur } from '@/lib/compare-image-blur'
import CompareLandscapeImage from './CompareLandscapeImage'
import { isCompareImageLandscape } from '@/lib/compare-image-meta'

type CompareSlide = {
	src: string
	blurDataURL: string
	landscape: boolean
}

const DEFAULT_INTERVAL_MS = 5000

type Props = {
	pairs: ComparePair[]
	labels: { primary: string; secondary: string }
	intervalMs?: number
}

function CompareFigure({
	slide,
	alt,
	label,
	priority
}: {
	slide: CompareSlide
	alt: string
	label: string
	priority?: boolean
}) {
	return (
		<figure className="landing-photo__figure">
			<div className="landing-photo__frame landing-compare__frame">
				{slide.landscape ? (
					<CompareLandscapeImage
						src={slide.src}
						blurDataURL={slide.blurDataURL}
						alt={alt}
						isActive
						priority={priority}
					/>
				) : (
					<Image
						src={assetPath(slide.src)}
						alt={alt}
						fill
						sizes="(max-width: 900px) 100vw, 50vw"
						className="landing-photo__img"
						placeholder="blur"
						blurDataURL={slide.blurDataURL}
						priority={priority}
					/>
				)}
			</div>
			<figcaption className="landing-photo__compare-label">{label}</figcaption>
		</figure>
	)
}

function toSlides(pairs: ComparePair[], getSrc: (pair: ComparePair) => string): CompareSlide[] {
	const lastIndex = pairs.length - 1
	return pairs.map((pair, index) => {
		const src = getSrc(pair)
		const isLandscape = isCompareImageLandscape(src)
		const usePan = isLandscape && index !== lastIndex
		return {
			src,
			blurDataURL: getCompareImageBlur(src),
			landscape: usePan
		}
	})
}

export default function LandingCompareCarousel({
	pairs,
	labels,
	intervalMs = DEFAULT_INTERVAL_MS
}: Props) {
	const reduceMotion = useReducedMotion()
	const scrollerRef = useRef<HTMLElement>(null)
	const [index, setIndex] = useState(0)
	const [autoplayPaused, setAutoplayPaused] = useState(false)
	const count = pairs.length

	const pauseAutoplay = useCallback(() => {
		setAutoplayPaused(true)
	}, [])

	const embeddedSlides = toSlides(pairs, (p) => p.embeddedSrc)
	const rawSlides = toSlides(pairs, (p) => p.rawClinicSrc)

	const scrollToIndex = useCallback(
		(next: number, options?: { autoplay?: boolean }) => {
			if (!options?.autoplay) pauseAutoplay()
			const el = scrollerRef.current
			if (!el || count === 0) return
			const i = ((next % count) + count) % count
			el.scrollTo({
				left: i * el.clientWidth,
				behavior: reduceMotion ? 'auto' : 'smooth'
			})
			setIndex(i)
		},
		[count, reduceMotion, pauseAutoplay]
	)

	useEffect(() => {
		const el = scrollerRef.current
		if (!el || count <= 1) return

		let raf = 0
		const onScroll = () => {
			cancelAnimationFrame(raf)
			raf = requestAnimationFrame(() => {
				const w = el.clientWidth
				if (w <= 0) return
				const next = Math.round(el.scrollLeft / w)
				setIndex((current) => (current === next ? current : next))
			})
		}

		el.addEventListener('scroll', onScroll, { passive: true })
		return () => {
			cancelAnimationFrame(raf)
			el.removeEventListener('scroll', onScroll)
		}
	}, [count])

	useEffect(() => {
		const el = scrollerRef.current
		if (!el || count <= 1) return

		const observer = new ResizeObserver(() => {
			const w = el.clientWidth
			if (w <= 0) return
			const i = Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / w)))
			el.scrollLeft = i * w
			setIndex(i)
		})
		observer.observe(el)
		return () => observer.disconnect()
	}, [count])

	useEffect(() => {
		if (reduceMotion || count <= 1 || autoplayPaused) return
		const id = window.setInterval(() => {
			scrollToIndex(index + 1, { autoplay: true })
		}, intervalMs)
		return () => window.clearInterval(id)
	}, [count, index, intervalMs, reduceMotion, scrollToIndex, autoplayPaused])

	if (count === 0) return null

	const active = pairs[index]

	return (
		<div className={clsx('landing-compare', reduceMotion && 'landing-compare--reduce-motion')}>
			<section
				ref={scrollerRef}
				className="landing-compare__scroller"
				aria-roledescription="carousel"
				aria-label="Swipe between photo comparisons"
				onPointerDown={pauseAutoplay}
				onWheel={pauseAutoplay}
			>
				{pairs.map((pair, slideIndex) => {
					const embedded = embeddedSlides[slideIndex]
					const raw = rawSlides[slideIndex]
					const isActive = slideIndex === index

					return (
						<section
							key={pair.id}
							className="landing-compare__slide"
							aria-hidden={!isActive}
							aria-label={`Comparison ${slideIndex + 1} of ${count}`}
						>
							<div className="landing-photo__spotlight-grid">
								<CompareFigure
									slide={embedded}
									alt={pair.alt}
									label={labels.primary}
									priority={slideIndex === 0}
								/>
								<CompareFigure
									slide={raw}
									alt={pair.alt}
									label={labels.secondary}
									priority={slideIndex === 0}
								/>
							</div>
						</section>
					)
				})}
			</section>

			{count > 1 && (
				<div
					className="landing-compare__page-control"
					role="tablist"
					aria-label="Comparison examples"
					onPointerDown={pauseAutoplay}
				>
					{pairs.map((pair, i) => (
						<button
							key={pair.id}
							type="button"
							role="tab"
							className={clsx(
								'landing-compare__dot',
								i === index && 'landing-compare__dot--active'
							)}
							aria-selected={i === index}
							aria-label={`Example ${i + 1}: ${pair.id}`}
							onClick={() => scrollToIndex(i)}
						/>
					))}
				</div>
			)}

			<p className="visually-hidden" aria-live="polite">
				Showing comparison {index + 1} of {count}: {active.alt}
			</p>
		</div>
	)
}
