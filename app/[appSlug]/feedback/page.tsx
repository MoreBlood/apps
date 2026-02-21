import { notFound } from 'next/navigation'
import { Box, Container } from '@radix-ui/themes'
import { getAppBySlug } from '@/config'

export default async function Feedback({ params }: { params: Promise<{ appSlug: string }> }) {
	const { appSlug } = await params
	const app = getAppBySlug(appSlug)
	if (!app) notFound()

	return (
		<Container size="2">
			<Box pt="6" style={{ overflow: 'hidden' }}>
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
