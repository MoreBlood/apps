'use client'

import { useId } from 'react'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { Link, Text } from '@radix-ui/themes'
import NextLink from 'next/link'
import { getAllBlogPosts } from '@/config/blog-content'
import LandingScrollProvider from '@/components/landing/LandingScrollProvider'
import { LandingReveal, LandingRevealItem, LandingRevealStagger } from '@/components/landing/LandingReveal'

export default function BlogPage() {
	const pageTitleId = useId()
	const posts = getAllBlogPosts()

	return (
		<LandingScrollProvider>
			<article className="landing blog-page">
				<section className="blog-page__hero" aria-labelledby={pageTitleId}>
					<LandingReveal direction="up" duration={0.65}>
						<p className="blog-page__eyebrow">Artihovich Apps</p>
						<h1 className="blog-page__title" id={pageTitleId}>
							Blog
						</h1>
						<p className="blog-page__lead">
							Notes on building native iOS apps — product decisions, photography workflows, and what we learn
							along the way.
						</p>
					</LandingReveal>
				</section>

				<LandingRevealStagger as="ul" className="landing-blog__list blog-page__list" stagger={0.08}>
					{posts.map((post) => (
						<LandingRevealItem key={post.slug} className="landing-blog__card-wrap">
							<article className="landing-blog__card">
								<Text as="p" className="landing-blog__meta" size="1">
									{post.publishedLabel}
									{post.readMinutes != null && ` · ${post.readMinutes} min read`}
								</Text>
								<h2 className="landing-blog__card-title">
									<a
										href={post.href}
										className="landing-blog__card-link"
										target="_blank"
										rel="noopener noreferrer"
									>
										{post.title}
										<ArrowTopRightIcon className="landing-blog__external" aria-hidden />
									</a>
								</h2>
								<p className="landing-blog__excerpt">{post.excerpt}</p>
								{post.relatedAppSlug && (
									<div className="blog-page__card-actions">
										<Link asChild size="2" color="gray" className="blog-page__related-link">
											<NextLink href={`/${post.relatedAppSlug}/`}>
												{post.relatedAppSlug === 'rawclinic' ? 'RAW Clinic' : post.relatedAppSlug}
											</NextLink>
										</Link>
									</div>
								)}
							</article>
						</LandingRevealItem>
					))}
				</LandingRevealStagger>
			</article>
		</LandingScrollProvider>
	)
}
