'use client'

import clsx from 'clsx'
import { type HTMLMotionProps, motion, useReducedMotion } from 'framer-motion'
import { landingEase, landingViewport } from '@/lib/landing-motion'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const offsetByDirection: Record<Direction, { x?: number; y?: number }> = {
	up: { y: 32 },
	down: { y: -24 },
	left: { x: -36 },
	right: { x: 36 },
	none: {}
}

type RevealProps = HTMLMotionProps<'div'> & {
	direction?: Direction
	delay?: number
	duration?: number
	as?: 'div' | 'section' | 'article' | 'footer'
}

export function LandingReveal({
	children,
	className,
	direction = 'up',
	delay = 0,
	duration = 0.65,
	as = 'div',
	...rest
}: RevealProps) {
	const reduceMotion = useReducedMotion()
	const Component = motion[as]
	const offset = offsetByDirection[direction]

	return (
		<Component
			className={clsx(className)}
			initial={reduceMotion ? false : { opacity: 0, ...offset }}
			whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
			viewport={landingViewport}
			transition={{ duration, delay, ease: landingEase }}
			{...rest}
		>
			{children}
		</Component>
	)
}

type HeroRevealProps = {
	children: React.ReactNode
	className?: string
}

/** Hero block — no enter animation so LCP (image + title) paints immediately. */
export function LandingHeroReveal({ children, className }: HeroRevealProps) {
	return <div className={className}>{children}</div>
}

export function LandingHeroItem({
	children,
	className,
	priority = false
}: {
	children: React.ReactNode
	className?: string
	/** Skip enter animation so LCP text paints immediately. */
	priority?: boolean
}) {
	const reduceMotion = useReducedMotion()

	if (priority || reduceMotion) {
		return <div className={className}>{children}</div>
	}

	return (
		<motion.div
			className={className}
			variants={{
				hidden: { opacity: 0, y: 24 },
				visible: {
					opacity: 1,
					y: 0,
					transition: { duration: 0.7, ease: landingEase }
				}
			}}
		>
			{children}
		</motion.div>
	)
}

type StaggerProps = {
	children: React.ReactNode
	className?: string
	as?: 'div' | 'ul' | 'section'
	stagger?: number
}

export function LandingRevealStagger({ children, className, as = 'div', stagger = 0.08 }: StaggerProps) {
	const reduceMotion = useReducedMotion()
	const Component = motion[as]

	return (
		<Component
			className={className}
			initial={reduceMotion ? false : 'hidden'}
			whileInView={reduceMotion ? undefined : 'visible'}
			viewport={landingViewport}
			variants={{
				hidden: {},
				visible: { transition: { staggerChildren: stagger } }
			}}
		>
			{children}
		</Component>
	)
}

export function LandingRevealItem({
	children,
	className,
	as = 'li',
	onMouseEnter,
	onMouseMove,
	onMouseLeave
}: {
	children: React.ReactNode
	className?: string
	as?: 'li' | 'div'
	onMouseEnter?: React.MouseEventHandler<HTMLElement>
	onMouseMove?: React.MouseEventHandler<HTMLElement>
	onMouseLeave?: React.MouseEventHandler<HTMLElement>
}) {
	const reduceMotion = useReducedMotion()
	const Component = motion[as]

	return (
		<Component
			className={className}
			onMouseEnter={onMouseEnter}
			onMouseMove={onMouseMove}
			onMouseLeave={onMouseLeave}
			variants={
				reduceMotion
					? undefined
					: {
							hidden: { opacity: 0, y: 22 },
							visible: {
								opacity: 1,
								y: 0,
								transition: { duration: 0.55, ease: landingEase }
							}
						}
			}
		>
			{children}
		</Component>
	)
}
