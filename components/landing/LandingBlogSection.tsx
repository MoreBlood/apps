'use client'

import { useId } from 'react'
import NextLink from 'next/link'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import type { LandingBlogSection as LandingBlogSectionConfig } from '@/types/landing'
import { LandingReveal } from './LandingReveal'

type Props = {
	section?: LandingBlogSectionConfig
}

export default function LandingBlogSection({ section }: Props) {
	const titleId = useId()
	const title = section?.title ?? 'Read our blog'
	const href = section?.href ?? '/blog'

	return (
		<LandingReveal as="section" className="landing-blog landing-blog--teaser" aria-labelledby={titleId}>
			<p className="landing-blog__eyebrow">Essays & updates</p>
			<h2 className="landing-blog__title" id={titleId}>
				<NextLink href={href} className="landing-blog__title-link">
					{title}
					<ArrowRightIcon className="landing-blog__arrow" aria-hidden />
				</NextLink>
			</h2>
		</LandingReveal>
	)
}
