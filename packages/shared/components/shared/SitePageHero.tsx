'use client'

import clsx from 'clsx'
import { type ReactNode, useId } from 'react'
import { LandingHeroItem, LandingHeroReveal, LandingReveal } from '@/components/landing/LandingReveal'

type Props = {
	eyebrow: string
	title: string
	lead?: string
	meta?: ReactNode
	children?: ReactNode
	className?: string
	titleId?: string
	/** Home landing — pill eyebrow, gradient title, hero reveal animation. */
	variant?: 'default' | 'home'
	animate?: boolean
}

export default function SitePageHero({
	eyebrow,
	title,
	lead,
	meta,
	children,
	className,
	titleId,
	variant = 'default',
	animate = variant === 'home'
}: Props) {
	const generatedId = useId()
	const headingId = titleId ?? generatedId

	if (variant === 'home') {
		return (
			<LandingHeroReveal className={clsx('landing-hero__inner', className)}>
				<LandingHeroItem>
					<p className="landing-hero__eyebrow">{eyebrow}</p>
				</LandingHeroItem>
				<LandingHeroItem>
					<h1 className="landing-hero__title" id={headingId}>
						{title}
					</h1>
				</LandingHeroItem>
				{lead ? (
					<LandingHeroItem>
						<p className="landing-hero__lead">{lead}</p>
					</LandingHeroItem>
				) : null}
			</LandingHeroReveal>
		)
	}

	const body = (
		<>
			<p className="site-page-hero__eyebrow">{eyebrow}</p>
			<h1 className="site-page-hero__title" id={headingId}>
				{title}
			</h1>
			{lead ? <p className="site-page-hero__lead">{lead}</p> : null}
			{meta ? <div className="site-page-hero__meta">{meta}</div> : null}
			{children ? <div className="site-page-hero__extra">{children}</div> : null}
		</>
	)

	return (
		<header className={clsx('site-page-hero', className)}>
			{animate ? (
				<LandingReveal direction="up" duration={0.65}>
					{body}
				</LandingReveal>
			) : (
				body
			)}
		</header>
	)
}
