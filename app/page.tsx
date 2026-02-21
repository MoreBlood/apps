import { Card, Container, Flex, Heading, Text } from '@radix-ui/themes'
import NextLink from 'next/link'
import { getApps } from '@/config'

function descriptionToParagraphs(text: string): string[] {
	return text
		.split(/\n\n+/)
		.map((s) => s.trim())
		.filter(Boolean)
}

export default function Home() {
	const apps = getApps()
	return (
		<Container size="2">
			<Heading size="8" mb="6" as="h1">
				Our Apps
			</Heading>
			<Flex direction="column" gap="3">
				{apps.map((app) => (
					<Card key={app.slug} size="2" asChild>
						<NextLink href={`/${app.slug}`}>
							<Flex direction="column" gap="2" p="4">
								<Heading size="5">{app.appName}</Heading>
								<Text size="2" color="gray">
									{app.tagline}
								</Text>
								<Text size="2" color="gray">
									{descriptionToParagraphs(app.description)[0]}
								</Text>
							</Flex>
						</NextLink>
					</Card>
				))}
			</Flex>
		</Container>
	)
}
