import { Container, Flex, Link as RadixLink } from '@radix-ui/themes'
import type { Metadata } from 'next'
import NextLink from 'next/link'
import SitePageHero from '@/components/shared/SitePageHero'
import { getAppBySlug, siteName } from '@/config'
import { getSingleAppSlug, isSingleAppSite } from '@/config/site-mode'

export function generateNotFoundMetadata(): Metadata {
	if (isSingleAppSite()) {
		const app = getAppBySlug(getSingleAppSlug())
		const appName = app?.appName ?? 'RAW Clinic'
		return {
			title: `Page not found · ${appName}`,
			description: `This page does not exist on ${appName}.`
		}
	}

	return {
		title: `Page not found · ${siteName}`,
		description: 'The page you requested does not exist.'
	}
}

export const metadata = generateNotFoundMetadata()

export default function NotFoundView() {
	const homeLabel = isSingleAppSite() ? (getAppBySlug(getSingleAppSlug())?.appName ?? 'Home') : 'Home'

	return (
		<Container size="2" className="site-prose not-found-page">
			<SitePageHero
				className="site-page-hero--section"
				eyebrow="404"
				title="Page not found"
				lead="The link may be outdated, or the page was moved. Try the home page or blog instead."
			/>
			<Flex gap="4" wrap="wrap" className="not-found-page__actions">
				<RadixLink asChild size="3" weight="medium">
					<NextLink href="/">{homeLabel}</NextLink>
				</RadixLink>
				<RadixLink asChild size="3" color="gray">
					<NextLink href="/blog">Blog</NextLink>
				</RadixLink>
			</Flex>
		</Container>
	)
}
