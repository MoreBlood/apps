'use client'

import clsx from 'clsx'
import { useLenis } from './LandingScrollProvider'

type Props = {
	href: string
	className?: string
	children: React.ReactNode
}

export default function LandingAnchorLink({ href, className, children }: Props) {
	const lenis = useLenis()

	const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (!href.startsWith('#')) return
		const target = document.querySelector<HTMLElement>(href)
		if (!target) return
		e.preventDefault()
		if (lenis) {
			lenis.scrollTo(target, { offset: -80, duration: 1.2 })
		} else {
			target.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}

	return (
		<a href={href} className={clsx(className)} onClick={onClick}>
			{children}
		</a>
	)
}
