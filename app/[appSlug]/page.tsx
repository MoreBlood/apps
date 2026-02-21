import NextImage from 'next/image'
import NextLink from 'next/link'
import { notFound } from 'next/navigation'
import {
	Box,
	Container,
	Heading,
	Link,
	Section,
	Strong,
	Text
} from '@radix-ui/themes'
import DescriptionText from '@/components/DescriptionText'
import { assetPath } from '@/lib/basePath'
import { getAppBySlug } from '@/config'

export default async function AppLanding({ params }: { params: Promise<{ appSlug: string }> }) {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) notFound()

	return (
		<Container size="2">
			<Heading size="8" mb="2" as="h1">
				{app.appName}
			</Heading>
			<Text size="3" color="gray" mb="4" as="p">
				{app.tagline}
			</Text>
			{app.storeLink && (
				<Box mb="4">
					<Link asChild>
						<NextLink
							href={app.storeLink}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Download on the App Store"
							style={{ display: 'inline-block', lineHeight: 0 }}
						>
							<NextImage
								src={assetPath('/app-store.svg')}
								alt="Download on the App Store"
								width={135}
								height={40}
								style={{ height: 40, width: 'auto' }}
							/>
						</NextLink>
					</Link>
				</Box>
			)}

			<Section size="2">
				<Heading size="6" mb="3" as="h2">
					About
				</Heading>
				{app.DescriptionContent ? (
					<app.DescriptionContent app={app} />
				) : (
					<DescriptionText text={app.description} />
				)}

				<Box mt="6" pt="6" style={{ borderTop: '1px solid var(--gray-a6)' }}>
					<Heading size="6" mb="3" as="h2">
						Contact Us
					</Heading>
					<Text as="p" mb="2">
						If you have any questions, please contact us at:
					</Text>
					<Text as="p">
						<Strong>Email: </Strong>
						<Link href={`mailto:${app.contactEmail}`}>{app.contactEmail}</Link>
					</Text>
				</Box>
			</Section>
		</Container>
	)
}
