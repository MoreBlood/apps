'use client'

import { useId, type ReactNode } from 'react'
import NextLink from 'next/link'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import type { LandingBlogSection as LandingBlogSectionConfig } from '@/types/landing'
import { LandingReveal } from './LandingReveal'

type Props = {
	appSlug: string
	section?: LandingBlogSectionConfig
}

function TeaserLink({ href, children }: { href: string; children: ReactNode }) {
	return (
		<NextLink href={href} className="landing-blog__title-link">
			{children}
			<ArrowRightIcon className="landing-blog__arrow" aria-hidden />
		</NextLink>
	)
}

export default function LandingBlogSection({ appSlug, section }: Props) {
	const blogTitleId = useId()
	const roadmapTitleId = useId()
	const blogTitle = section?.title ?? 'Read our blog'
	const blogHref = section?.href ?? '/blog'
	const roadmapTitle = section?.roadmapTitle
	const roadmapEyebrow = section?.roadmapEyebrow ?? 'Product'
	const roadmapHref = section?.roadmapHref ?? `/${appSlug}/roadmap`

	return (
		<LandingReveal
			as="section"
			className="landing-blog landing-blog--teaser"
			aria-label="Blog and roadmap"
		>
			<div className="landing-blog__teaser-grid">
				<article className="landing-blog__teaser-item" aria-labelledby={blogTitleId}>
					<p className="landing-blog__eyebrow">Essays & updates</p>
					<h2 className="landing-blog__title" id={blogTitleId}>
						<TeaserLink href={blogHref}>{blogTitle}</TeaserLink>
					</h2>
				</article>
				{roadmapTitle && (
					<article className="landing-blog__teaser-item" aria-labelledby={roadmapTitleId}>
						<p className="landing-blog__eyebrow">{roadmapEyebrow}</p>
						<h2 className="landing-blog__title" id={roadmapTitleId}>
							<TeaserLink href={roadmapHref}>{roadmapTitle}</TeaserLink>
						</h2>
					</article>
				)}
			</div>
		</LandingReveal>
	)
}
