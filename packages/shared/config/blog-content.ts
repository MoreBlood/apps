export type BlogPost = {
	slug: string
	title: string
	excerpt: string
	href: string
	publishedLabel: string
	readMinutes?: number
	/** App slug when the post is primarily about one product. */
	relatedAppSlug?: string
}

export const blogPosts: BlogPost[] = [
	{
		slug: 'apple-proraw-is-not-dead',
		title: 'Apple Pro RAW is not dead',
		excerpt:
			'Why gallery previews undersell ProRAW, how iPhone 15 Pro RAW compared to a dedicated camera on a PC, and why I built an on-device editor instead of carrying a laptop.',
		href: 'https://medium.com/@artihovich.it/raw-clinic-apple-pro-raw-is-not-dead-a6876538978d',
		publishedLabel: 'February 8, 2026',
		readMinutes: 4,
		relatedAppSlug: 'rawclinic'
	}
]

export function getAllBlogPosts(): BlogPost[] {
	return blogPosts
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
	return blogPosts.find((post) => post.slug === slug) ?? null
}

export function getBlogPostsBySlugs(slugs: string[]): BlogPost[] {
	const bySlug = new Map(blogPosts.map((post) => [post.slug, post]))
	return slugs.map((slug) => bySlug.get(slug)).filter((post): post is BlogPost => post != null)
}
