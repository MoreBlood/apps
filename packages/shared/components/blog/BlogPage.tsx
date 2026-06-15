'use client'

import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { Container, Link, Text } from '@radix-ui/themes'
import NextLink from 'next/link'
import { LandingRevealItem, LandingRevealStagger } from '@/components/landing/LandingReveal'
import SitePageHero from '@/components/shared/SitePageHero'
import { getAppBySlug, siteName } from '@/config'
import { getPublishedBlogPosts } from '@/config/blog-content'
import { getSingleAppSlug, isSingleAppSite } from '@/config/site-mode'

function relatedAppHref(relatedAppSlug: string): string {
	if (isSingleAppSite() && relatedAppSlug === getSingleAppSlug()) {
		return '/'
	}
	return `/${relatedAppSlug}/`
}

export default function BlogPage() {
	const posts = getPublishedBlogPosts()
	const singleApp = isSingleAppSite() ? getAppBySlug(getSingleAppSlug()) : null
	const eyebrow = singleApp?.appName ?? siteName
	const lead = singleApp
		? 'Notes on ProRAW workflows, on-device editing, and building RAW Clinic.'
		: 'Notes on building native iOS apps — product decisions, photography workflows, and what we learn along the way.'

	return (
		<Container size="2" className="landing blog-page">
			<SitePageHero className="site-page-hero--section" eyebrow={eyebrow} title="Blog" lead={lead} animate />

			<LandingRevealStagger as="ul" className="landing-blog__list blog-page__list" stagger={0.08}>
				{posts.map((post) => (
					<LandingRevealItem key={post.slug} className="landing-blog__card-wrap">
						<article className="landing-blog__card">
							<Text as="p" className="landing-blog__meta" size="1">
								{post.publishedLabel}
								{post.readMinutes != null && ` · ${post.readMinutes} min read`}
							</Text>
							<h2 className="landing-blog__card-title">
								<a href={post.href} className="landing-blog__card-link" target="_blank" rel="noopener noreferrer">
									{post.title}
									<ArrowTopRightIcon className="landing-blog__external" aria-hidden />
								</a>
							</h2>
							<p className="landing-blog__excerpt">{post.excerpt}</p>
							{post.relatedAppSlug && (
								<div className="blog-page__card-actions">
									<Link asChild size="2" color="gray" className="blog-page__related-link">
										<NextLink href={relatedAppHref(post.relatedAppSlug)}>
											{post.relatedAppSlug === 'rawclinic' ? 'RAW Clinic' : post.relatedAppSlug}
										</NextLink>
									</Link>
								</div>
							)}
						</article>
					</LandingRevealItem>
				))}
			</LandingRevealStagger>
		</Container>
	)
}
