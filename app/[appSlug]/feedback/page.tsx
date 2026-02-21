import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Box, Container, Text } from '@radix-ui/themes'
import { getAppBySlug } from '@/config'

export async function generateMetadata({
	params
}: {
	params: Promise<{ appSlug: string }>
}): Promise<Metadata> {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) return { title: 'App not found' }
	return {
		title: `Feedback - ${app.appName}`,
		description: `Send feedback for ${app.appName}. ${app.tagline}.`
	}
}

export default async function Feedback({ params }: { params: Promise<{ appSlug: string }> }) {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) notFound()

	return (
		<Container size="2">
			<Text as="p" size="2" color="gray" mb="3">
				Feedback form opens below.
			</Text>
			<Box pt="2" style={{ overflow: 'hidden' }}>
				<iframe
					src={app.feedbackFormUrl}
					width="100%"
					height="1480px"
					frameBorder={0}
					title={`${app.appName} Feedback Form`}
				>
					Loading…
				</iframe>
			</Box>
		</Container>
	)
}
