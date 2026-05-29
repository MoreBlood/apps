'use client'

import { useId } from 'react'
import NextLink from 'next/link'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import type { LandingBlogSection as LandingBlogSectionConfig } from '@/types/landing'
import {
	LANDING_SURFACE_METAL_DOTS,
	landingSurfaceClassName
} from '@/lib/landing-surface'
import LandingSurfaceLayers from './LandingSurfaceLayers'
import { LandingReveal } from './LandingReveal'

type Props = {
	appSlug: string
	section?: LandingBlogSectionConfig
}

const teaserSurface = LANDING_SURFACE_METAL_DOTS

type TeaserCardProps = {
	href: string
	eyebrow: string
	title: string
	titleId: string
}

function BlogTeaserCard({ href, eyebrow, title, titleId }: TeaserCardProps) {
	return (
		<NextLink
			href={href}
			className={landingSurfaceClassName(teaserSurface, 'landing-blog__teaser-item')}
			aria-labelledby={titleId}
		>
			<LandingSurfaceLayers effects={teaserSurface} />
			<p className="landing-blog__eyebrow">{eyebrow}</p>
			<h2 className="landing-blog__title" id={titleId}>
				<span className="landing-blog__title-text">{title}</span>
				<ArrowRightIcon className="landing-blog__arrow" aria-hidden />
			</h2>
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
				<BlogTeaserCard
					href={blogHref}
					eyebrow="Essays & updates"
					title={blogTitle}
					titleId={blogTitleId}
				/>
				{roadmapTitle && (
					<BlogTeaserCard
						href={roadmapHref}
						eyebrow={roadmapEyebrow}
						title={roadmapTitle}
						titleId={roadmapTitleId}
					/>
				)}
			</div>
		</LandingReveal>
	)
}
