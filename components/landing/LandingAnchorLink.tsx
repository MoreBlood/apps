'use client'

import NextLink from 'next/link'
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
		const id = href.slice(1)
		const target = document.getElementById(id)
		if (!target) return
		e.preventDefault()
		if (lenis) {
			lenis.scrollTo(target, { offset: -80, duration: 1.2 })
		} else {
			target.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}

	return (
		<NextLink href={href} className={className} onClick={onClick}>
			{children}
		</NextLink>
	)
}
