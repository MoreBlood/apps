'use client'

import clsx from 'clsx'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import {
	type CSSProperties,
	type PointerEvent as ReactPointerEvent,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState
} from 'react'
import { createPortal } from 'react-dom'
import type { ComparePair } from '@/config/compare-content'
import { getCompareImageMeta, isCompareImageLandscape } from '@/lib/compare-image-meta'
import { isLandingFocusBlurEnabled } from '@/lib/landing-focus-blur'
import {
	clearLandingFocusOpen,
	clearLandingFocusPresent,
	setLandingFocusOpen,
	setLandingFocusPresent
} from '@/lib/landing-focus-dom-state'
import { resolveOptimizedImage } from '@/lib/optimized-image'
import CompareLandscapeImage from './CompareLandscapeImage'
import { useLenis } from './LandingScrollProvider'

type ScrimMotionState = {
	opacity: number
	'--landing-stage-scrim-blur': string
}

type CompareSlide = {
	/** Original config path for aspect / landscape checks. */
	sourceKey: string
	blurDataURL: string
	landscape: boolean
}

const DEFAULT_INTERVAL_MS = 5000

type Props = {
	pairs: ComparePair[]
	labels: { primary: string; secondary: string }
	intervalMs?: number
}

type CompareFocusOverlay = {
	slide: CompareSlide
	alt: string
	sourceKey: string
	sourceEl: HTMLElement
	from: DOMRect
	target: FocusBox
}

type FocusBox = {
	left: number
	top: number
	width: number
	height: number
}

function toDocumentBox(box: FocusBox): FocusBox {
	return {
		left: box.left + window.scrollX,
		top: box.top + window.scrollY,
		width: box.width,
		height: box.height
	}
}

const COMPARE_ENTER_TRANSITION = { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const }
const COMPARE_EXIT_TRANSITION = { duration: 0.46, ease: [0.32, 0, 0.67, 0] as const }
const COMPARE_SCRIM_ENTER_TRANSITION = { duration: 0.36, ease: [0.32, 0.72, 0, 1] as const }
const COMPARE_SCRIM_EXIT_TRANSITION = COMPARE_EXIT_TRANSITION
const SCRIM_INITIAL = { opacity: 0, '--landing-stage-scrim-blur': '0px' } as ScrimMotionState
const SCRIM_ANIMATE = { opacity: 1, '--landing-stage-scrim-blur': '12px' } as ScrimMotionState
const SCRIM_ANIMATE_NO_BLUR = { opacity: 1, '--landing-stage-scrim-blur': '0px' } as ScrimMotionState
const SCRIM_EXIT = SCRIM_INITIAL
const COMPARE_FOCUS_MAX_ZOOM = 4
const COMPARE_FOCUS_FRAME_STYLE: CSSProperties = {
	position: 'absolute',
	inset: 0,
	width: '100%',
	height: '100%',
	boxSizing: 'border-box',
	padding: 2,
	overflow: 'hidden',
	borderRadius: 'var(--radius-4)',
	background:
		'linear-gradient(135deg, color-mix(in srgb, white 52%, var(--landing-metal-rim-light)), var(--landing-metal-rim) 48%, color-mix(in srgb, black 18%, var(--landing-metal-rim-shade)))',
	border: 0,
	boxShadow:
		'0 0 0 1px color-mix(in srgb, white 24%, var(--landing-metal-rim-light)), 0 18px 54px color-mix(in srgb, black 18%, transparent)',
	transform: 'translateZ(0)'
}
const COMPARE_FOCUS_MEDIA_STYLE: CSSProperties = {
	position: 'relative',
	width: '100%',
	height: '100%',
	overflow: 'hidden',
	borderRadius: 'calc(var(--radius-4) - 2px)',
	background: 'var(--gray-a3)'
}
const COMPARE_FOCUS_IMAGE_STYLE: CSSProperties = {
	objectFit: 'cover',
	objectPosition: 'center'
}

type ZoomState = {
	scale: number
	x: number
	y: number
}

type Point = {
	x: number
	y: number
}

type PinchGesture = {
	distance: number
	midpoint: Point
	scale: number
	x: number
	y: number
}

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value))
}

function distance(a: Point, b: Point) {
	return Math.hypot(a.x - b.x, a.y - b.y)
}

function midpoint(a: Point, b: Point): Point {
	return {
		x: (a.x + b.x) / 2,
		y: (a.y + b.y) / 2
	}
}

function clampZoomOffset(frame: HTMLElement | null, zoom: ZoomState): ZoomState {
	if (!frame || zoom.scale <= 1) return { scale: Math.max(1, zoom.scale), x: 0, y: 0 }

	const rect = frame.getBoundingClientRect()
	const maxX = (rect.width * (zoom.scale - 1)) / 2
	const maxY = (rect.height * (zoom.scale - 1)) / 2
	return {
		scale: zoom.scale,
		x: clamp(zoom.x, -maxX, maxX),
		y: clamp(zoom.y, -maxY, maxY)
	}
}

function getCompareFocusOverlay(el: HTMLElement, slide: CompareSlide, alt: string): CompareFocusOverlay {
	const from = el.getBoundingClientRect()
	const image = resolveOptimizedImage(slide.sourceKey)
	const meta = getCompareImageMeta(slide.sourceKey)
	const width = meta?.width ?? image.width
	const height = meta?.height ?? image.height
	const aspect = width / height
	const inset = Math.max(24, Math.min(window.innerWidth, window.innerHeight) * 0.06)
	const availableWidth = Math.max(1, window.innerWidth - inset * 2)
	const availableHeight = Math.max(1, window.innerHeight - inset * 2)
	let targetWidth = availableWidth
	let targetHeight = targetWidth / aspect

	if (targetHeight > availableHeight) {
		targetHeight = availableHeight
		targetWidth = targetHeight * aspect
	}

	return {
		slide,
		alt,
		sourceKey: slide.sourceKey,
		sourceEl: el,
		from,
		target: {
			left: (window.innerWidth - targetWidth) / 2,
			top: (window.innerHeight - targetHeight) / 2,
			width: targetWidth,
			height: targetHeight
		}
	}
}

function CompareFigure({
	slide,
	alt,
	label,
	shouldLoad,
	panActive = false,
	isHidden = false,
	onFocusImage
}: {
	slide: CompareSlide
	alt: string
	label: string
	shouldLoad: boolean
	panActive?: boolean
	isHidden?: boolean
	onFocusImage?: (el: HTMLElement, slide: CompareSlide, alt: string) => void
}) {
	const image = resolveOptimizedImage(slide.sourceKey)

	return (
		<figure
			className={clsx(
				'landing-photo__figure landing-photo__figure--compare',
				isHidden && 'landing-photo__figure--focus-hidden'
			)}
		>
			<button
				type="button"
				className="landing-photo__frame landing-compare__frame"
				disabled={!onFocusImage}
				aria-label={onFocusImage ? `Open ${label} comparison image` : undefined}
				onClick={onFocusImage ? (e) => onFocusImage(e.currentTarget, slide, alt) : undefined}
			>
				{shouldLoad ? (
					slide.landscape ? (
						<CompareLandscapeImage
							src={slide.sourceKey}
							blurDataURL={slide.blurDataURL}
							alt={alt}
							isActive={panActive}
							priority={false}
						/>
					) : (
						<Image
							src={image.src}
							alt={alt}
							fill
							sizes="(max-width: 900px) 100vw, 50vw"
							className="landing-photo__img"
							placeholder="blur"
							blurDataURL={slide.blurDataURL}
							loading="lazy"
						/>
					)
				) : (
					<div
						className="landing-photo__img landing-photo__img--placeholder"
						aria-hidden
						style={{
							backgroundImage: `url(${slide.blurDataURL})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						}}
					/>
				)}
			</button>
			<figcaption className="landing-photo__compare-label">{label}</figcaption>
		</figure>
	)
}

function CompareFocusImage({
	overlay,
	open,
	onRequestClose,
	onCloseComplete
}: {
	overlay: CompareFocusOverlay
	open: boolean
	onRequestClose: () => void
	onCloseComplete: () => void
}) {
	const image = resolveOptimizedImage(overlay.slide.sourceKey)
	const initialBox = open ? overlay.from : toDocumentBox(overlay.target)
	const animateBox = open ? overlay.target : toDocumentBox(overlay.from)
	const frameRef = useRef<HTMLDivElement>(null)
	const pointersRef = useRef(new Map<number, Point>())
	const pinchRef = useRef<PinchGesture | null>(null)
	const panRef = useRef<{ pointerId: number; point: Point; x: number; y: number } | null>(null)
	const gestureMovedRef = useRef(false)
	const [zoom, setZoom] = useState<ZoomState>({ scale: 1, x: 0, y: 0 })

	useEffect(() => {
		setZoom({ scale: 1, x: 0, y: 0 })
		pointersRef.current.clear()
		pinchRef.current = null
		panRef.current = null
		gestureMovedRef.current = false
	}, [overlay.sourceKey, open])

	const beginPinch = useCallback(() => {
		const points = Array.from(pointersRef.current.values())
		if (points.length < 2) return
		pinchRef.current = {
			distance: Math.max(1, distance(points[0], points[1])),
			midpoint: midpoint(points[0], points[1]),
			scale: zoom.scale,
			x: zoom.x,
			y: zoom.y
		}
		gestureMovedRef.current = true
		panRef.current = null
	}, [zoom])

	const handlePointerDown = useCallback(
		(e: ReactPointerEvent<HTMLElement>) => {
			if (!open) return
			e.preventDefault()
			e.stopPropagation()
			e.currentTarget.setPointerCapture(e.pointerId)
			const point = { x: e.clientX, y: e.clientY }
			pointersRef.current.set(e.pointerId, point)
			gestureMovedRef.current = false

			if (pointersRef.current.size >= 2) {
				beginPinch()
				return
			}

			if (zoom.scale > 1) {
				panRef.current = { pointerId: e.pointerId, point, x: zoom.x, y: zoom.y }
			}
		},
		[beginPinch, open, zoom]
	)

	const handlePointerMove = useCallback(
		(e: ReactPointerEvent<HTMLElement>) => {
			if (!open || !pointersRef.current.has(e.pointerId)) return
			e.preventDefault()
			e.stopPropagation()
			const point = { x: e.clientX, y: e.clientY }
			pointersRef.current.set(e.pointerId, point)

			if (pointersRef.current.size >= 2 && pinchRef.current) {
				const points = Array.from(pointersRef.current.values())
				const nextMidpoint = midpoint(points[0], points[1])
				const nextScale = clamp(
					pinchRef.current.scale * (distance(points[0], points[1]) / pinchRef.current.distance),
					1,
					COMPARE_FOCUS_MAX_ZOOM
				)
				const frameRect = frameRef.current?.getBoundingClientRect()
				const center = frameRect
					? { x: frameRect.left + frameRect.width / 2, y: frameRect.top + frameRect.height / 2 }
					: { x: nextMidpoint.x, y: nextMidpoint.y }
				const ratio = nextScale / Math.max(1, pinchRef.current.scale)
				const nextZoom = clampZoomOffset(frameRef.current, {
					scale: nextScale,
					x: nextMidpoint.x - center.x - ratio * (pinchRef.current.midpoint.x - center.x - pinchRef.current.x),
					y: nextMidpoint.y - center.y - ratio * (pinchRef.current.midpoint.y - center.y - pinchRef.current.y)
				})
				setZoom(nextZoom)
				return
			}

			if (panRef.current?.pointerId === e.pointerId) {
				if (distance(panRef.current.point, point) > 4) {
					gestureMovedRef.current = true
				}
				setZoom((current) =>
					clampZoomOffset(frameRef.current, {
						scale: current.scale,
						x: panRef.current ? panRef.current.x + point.x - panRef.current.point.x : current.x,
						y: panRef.current ? panRef.current.y + point.y - panRef.current.point.y : current.y
					})
				)
			}
		},
		[open]
	)

	const handlePointerUp = useCallback(
		(e: ReactPointerEvent<HTMLElement>) => {
			e.stopPropagation()
			pointersRef.current.delete(e.pointerId)
			if (pointersRef.current.size >= 2) {
				const points = Array.from(pointersRef.current.values())
				pinchRef.current = {
					distance: Math.max(1, distance(points[0], points[1])),
					midpoint: midpoint(points[0], points[1]),
					scale: zoom.scale,
					x: zoom.x,
					y: zoom.y
				}
				return
			}

			pinchRef.current = null
			const remaining = Array.from(pointersRef.current.entries())[0]
			panRef.current =
				remaining && zoom.scale > 1 ? { pointerId: remaining[0], point: remaining[1], x: zoom.x, y: zoom.y } : null
		},
		[zoom]
	)

	return (
		<motion.div
			key={`${overlay.slide.sourceKey}-${open ? 'fixed' : 'document'}`}
			className="landing-compare-focus-clone"
			initial={{
				left: initialBox.left,
				top: initialBox.top,
				width: initialBox.width,
				height: initialBox.height
			}}
			animate={{
				...animateBox,
				transition: open ? COMPARE_ENTER_TRANSITION : COMPARE_EXIT_TRANSITION
			}}
			onAnimationComplete={() => {
				if (!open) onCloseComplete()
			}}
		>
			<button
				type="button"
				className="landing-compare-focus-clone__gesture"
				aria-label="Close image preview"
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerUp}
				onClick={(e) => {
					e.stopPropagation()
					if (gestureMovedRef.current) {
						gestureMovedRef.current = false
						return
					}
					if (zoom.scale > 1) {
						setZoom({ scale: 1, x: 0, y: 0 })
						return
					}
					onRequestClose()
				}}
			/>
			<div
				ref={frameRef}
				className="landing-compare-focus-clone__frame landing-photo__frame"
				style={COMPARE_FOCUS_FRAME_STYLE}
			>
				<div
					className="landing-compare-focus-clone__media"
					style={{
						...COMPARE_FOCUS_MEDIA_STYLE,
						transform: `translate3d(${zoom.x}px, ${zoom.y}px, 0) scale(${zoom.scale})`,
						transition: pointersRef.current.size > 0 ? 'none' : 'transform 0.2s ease',
						willChange: zoom.scale > 1 ? 'transform' : undefined
					}}
				>
					<Image
						src={image.src}
						alt=""
						fill
						sizes="100vw"
						className="landing-photo__img"
						style={COMPARE_FOCUS_IMAGE_STYLE}
						placeholder="blur"
						blurDataURL={overlay.slide.blurDataURL}
						draggable={false}
					/>
				</div>
			</div>
		</motion.div>
	)
}

function toSlides(pairs: ComparePair[], getSrc: (pair: ComparePair) => string): CompareSlide[] {
	const lastIndex = pairs.length - 1
	return pairs.map((pair, index) => {
		const src = getSrc(pair)
		const isLandscape = isCompareImageLandscape(src)
		const usePan = isLandscape && index !== lastIndex
		const { blurDataURL } = resolveOptimizedImage(src)
		return {
			sourceKey: src,
			blurDataURL,
			landscape: usePan
		}
	})
}

export default function LandingCompareCarousel({ pairs, labels, intervalMs = DEFAULT_INTERVAL_MS }: Props) {
	const reduceMotion = useReducedMotion()
	const lenis = useLenis()
	const focusBlurEnabled = isLandingFocusBlurEnabled()
	const scrollerRef = useRef<HTMLElement>(null)
	const compareRef = useRef<HTMLDivElement>(null)
	const indexRef = useRef(0)
	const scrollLockRef = useRef<number | null>(null)
	const [index, setIndex] = useState(0)
	indexRef.current = index
	const [autoplayPaused, setAutoplayPaused] = useState(false)
	const [portalReady, setPortalReady] = useState(false)
	const [focusOverlay, setFocusOverlay] = useState<CompareFocusOverlay | null>(null)
	const [focusOpen, setFocusOpen] = useState(false)
	const focusOpenRef = useRef(false)
	const openTokenRef = useRef(Symbol('landing-compare-open'))
	const presentTokenRef = useRef(Symbol('landing-compare-present'))
	const focusedSourceKey = focusOverlay?.sourceKey
	const [inView, setInView] = useState(false)
	const [hasBeenInView, setHasBeenInView] = useState(false)
	const [documentVisible, setDocumentVisible] = useState(
		() => typeof document !== 'undefined' && document.visibilityState === 'visible'
	)
	const count = pairs.length
	const pageControlRef = useRef<HTMLDivElement>(null)
	const [thumb, setThumb] = useState({ x: 0, w: 0 })

	const pauseAutoplay = useCallback(() => {
		setAutoplayPaused(true)
	}, [])

	const embeddedSlides = toSlides(pairs, (p) => p.embeddedSrc)
	const rawSlides = toSlides(pairs, (p) => p.rawClinicSrc)

	useEffect(() => {
		setPortalReady(true)
	}, [])

	const refreshCompareFocusOverlay = useCallback(() => {
		setFocusOverlay((current) => {
			if (!current) return current
			const rect = current.sourceEl.getBoundingClientRect()
			if (!focusOpenRef.current) {
				return { ...current, from: rect }
			}
			return getCompareFocusOverlay(current.sourceEl, current.slide, current.alt)
		})
	}, [])

	const closeCompareFocus = useCallback(() => {
		refreshCompareFocusOverlay()
		setFocusOpen(false)
	}, [refreshCompareFocusOverlay])

	focusOpenRef.current = focusOpen

	const handleCompareFocusCloseComplete = useCallback(() => {
		setFocusOverlay(null)
	}, [])

	useEffect(() => {
		const present = focusOpen || focusOverlay != null
		setLandingFocusPresent(presentTokenRef.current, present)
		const anyOpen = setLandingFocusOpen(openTokenRef.current, focusOpen)
		if (anyOpen) {
			lenis?.stop()
		} else {
			lenis?.start()
		}
	}, [focusOpen, focusOverlay, lenis])

	useEffect(() => {
		return () => {
			clearLandingFocusPresent(presentTokenRef.current)
			const anyOpen = clearLandingFocusOpen(openTokenRef.current)
			if (!anyOpen) lenis?.start()
		}
	}, [lenis])

	useEffect(() => {
		if (!focusOpen) return
		const onEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault()
				closeCompareFocus()
			}
		}
		window.addEventListener('keydown', onEscape)
		return () => window.removeEventListener('keydown', onEscape)
	}, [closeCompareFocus, focusOpen])

	useEffect(() => {
		if (!focusOverlay || typeof window === 'undefined') return
		let raf = 0
		const refresh = () => {
			window.cancelAnimationFrame(raf)
			raf = window.requestAnimationFrame(refreshCompareFocusOverlay)
		}
		const observer = new ResizeObserver(refresh)

		observer.observe(focusOverlay.sourceEl)
		window.addEventListener('resize', refresh)
		window.visualViewport?.addEventListener('resize', refresh)
		return () => {
			window.cancelAnimationFrame(raf)
			observer.disconnect()
			window.removeEventListener('resize', refresh)
			window.visualViewport?.removeEventListener('resize', refresh)
		}
	}, [focusOverlay, refreshCompareFocusOverlay])

	const focusCompareImage = useCallback(
		(el: HTMLElement, slide: CompareSlide, alt: string) => {
			pauseAutoplay()
			setFocusOverlay(getCompareFocusOverlay(el, slide, alt))
			setFocusOpen(true)
		},
		[pauseAutoplay]
	)

	const updateThumb = useCallback(() => {
		const control = pageControlRef.current
		if (!control) return
		const btn = control.querySelector<HTMLElement>(`[data-dot-index="${index}"]`)
		if (!btn) return
		setThumb({ x: btn.offsetLeft, w: btn.offsetWidth })
	}, [index])

	useLayoutEffect(() => {
		updateThumb()
		const control = pageControlRef.current
		if (!control) return
		const observer = new ResizeObserver(() => updateThumb())
		observer.observe(control)
		return () => observer.disconnect()
	}, [updateThumb, count])

	const syncIndexFromScroll = useCallback((el: HTMLElement) => {
		const slides = Array.from(el.children) as HTMLElement[]
		if (slides.length === 0) return

		const scrollLeft = el.scrollLeft
		let next = 0
		let best = Number.POSITIVE_INFINITY
		for (let i = 0; i < slides.length; i++) {
			const dist = Math.abs(slides[i].offsetLeft - scrollLeft)
			if (dist < best) {
				best = dist
				next = i
			}
		}
		setIndex((current) => (current === next ? current : next))
	}, [])

	const scrollToIndex = useCallback(
		(next: number, options?: { autoplay?: boolean }) => {
			if (!options?.autoplay) pauseAutoplay()
			const el = scrollerRef.current
			if (!el || count === 0) return
			const i = ((next % count) + count) % count
			const slide = el.children[i] as HTMLElement | undefined
			const targetLeft = slide?.offsetLeft ?? i * el.clientWidth

			scrollLockRef.current = i
			setIndex(i)

			el.scrollTo({
				left: targetLeft,
				behavior: reduceMotion ? 'auto' : 'smooth'
			})

			if (reduceMotion || Math.abs(el.scrollLeft - targetLeft) < 2) {
				scrollLockRef.current = null
			}
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
				const locked = scrollLockRef.current
				if (locked != null) {
					const slide = el.children[locked] as HTMLElement | undefined
					if (slide && Math.abs(slide.offsetLeft - el.scrollLeft) < 4) {
						scrollLockRef.current = null
						syncIndexFromScroll(el)
					}
					return
				}
				syncIndexFromScroll(el)
			})
		}

		const onScrollEnd = () => {
			scrollLockRef.current = null
			syncIndexFromScroll(el)
		}

		el.addEventListener('scroll', onScroll, { passive: true })
		el.addEventListener('scrollend', onScrollEnd)
		return () => {
			cancelAnimationFrame(raf)
			el.removeEventListener('scroll', onScroll)
			el.removeEventListener('scrollend', onScrollEnd)
		}
	}, [count, syncIndexFromScroll])

	useEffect(() => {
		const el = scrollerRef.current
		if (!el || count <= 1) return

		let width = el.clientWidth
		const observer = new ResizeObserver(() => {
			const nextWidth = el.clientWidth
			if (Math.abs(nextWidth - width) < 1) return
			width = nextWidth

			const slide = el.children[indexRef.current] as HTMLElement | undefined
			if (slide) el.scrollLeft = slide.offsetLeft
		})
		observer.observe(el)
		return () => observer.disconnect()
	}, [count])

	useEffect(() => {
		const root = compareRef.current
		if (!root) return

		const observer = new IntersectionObserver(
			([entry]) => {
				const visible = entry.isIntersecting
				setInView(visible)
				if (visible) setHasBeenInView(true)
			},
			{ threshold: 0.05, rootMargin: '120px 0px' }
		)
		observer.observe(root)
		return () => observer.disconnect()
	}, [])

	useEffect(() => {
		const onVisibility = () => setDocumentVisible(document.visibilityState === 'visible')
		document.addEventListener('visibilitychange', onVisibility)
		return () => document.removeEventListener('visibilitychange', onVisibility)
	}, [])

	useEffect(() => {
		if (reduceMotion || count <= 1 || autoplayPaused || !inView || !documentVisible) return

		const id = window.setInterval(() => {
			scrollToIndex(index + 1, { autoplay: true })
		}, intervalMs)
		return () => window.clearInterval(id)
	}, [count, index, intervalMs, reduceMotion, scrollToIndex, autoplayPaused, inView, documentVisible])

	if (count === 0) return null

	const active = pairs[index]

	return (
		<div ref={compareRef} className={clsx('landing-compare', reduceMotion && 'landing-compare--reduce-motion')}>
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
					const shouldLoad = hasBeenInView

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
									shouldLoad={shouldLoad}
									panActive={isActive}
									isHidden={focusedSourceKey === embedded.sourceKey}
									onFocusImage={focusCompareImage}
								/>
								<CompareFigure
									slide={raw}
									alt={pair.alt}
									label={labels.secondary}
									shouldLoad={shouldLoad}
									panActive={isActive}
									isHidden={focusedSourceKey === raw.sourceKey}
									onFocusImage={focusCompareImage}
								/>
							</div>
						</section>
					)
				})}
			</section>

			{count > 1 && (
				<div
					ref={pageControlRef}
					className="landing-compare__page-control"
					role="tablist"
					aria-label="Comparison examples"
					onPointerDown={pauseAutoplay}
				>
					<span
						className={clsx('landing-compare__thumb', reduceMotion && 'landing-compare__thumb--instant')}
						aria-hidden
						style={
							{
								'--compare-thumb-x': `${thumb.x}px`,
								'--compare-thumb-w': `${thumb.w}px`
							} as React.CSSProperties
						}
					/>
					{pairs.map((pair, i) => (
						<button
							key={pair.id}
							type="button"
							role="tab"
							data-dot-index={i}
							className={clsx('landing-compare__dot', i === index && 'landing-compare__dot--active')}
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

			{portalReady && focusOverlay
				? createPortal(
						<AnimatePresence>
							{focusOpen ? (
								<motion.button
									key="landing-compare-scrim"
									type="button"
									className="landing-stage-scrim"
									aria-label="Close image preview"
									onClick={closeCompareFocus}
									initial={SCRIM_INITIAL}
									animate={focusBlurEnabled ? SCRIM_ANIMATE : SCRIM_ANIMATE_NO_BLUR}
									exit={SCRIM_EXIT}
									transition={focusOpen ? COMPARE_SCRIM_ENTER_TRANSITION : COMPARE_SCRIM_EXIT_TRANSITION}
								/>
							) : null}
						</AnimatePresence>,
						document.body
					)
				: null}
			{portalReady && focusOverlay
				? createPortal(
						<div
							className={clsx('landing-compare-focus-layer', !focusOpen && 'landing-compare-focus-layer--document')}
							aria-hidden
						>
							<CompareFocusImage
								overlay={focusOverlay}
								open={focusOpen}
								onRequestClose={closeCompareFocus}
								onCloseComplete={handleCompareFocusCloseComplete}
							/>
						</div>,
						document.body
					)
				: null}
		</div>
	)
}
