import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { Box, Container, Flex, Heading, Text } from '@radix-ui/themes'
import AppContactCta from '@/components/AppContactCta'
import FeedbackForm from '@/components/feedback/FeedbackForm'
import type { AppConfig } from '@/config'

type Props = {
	app: AppConfig
	appSlug: string
}

export default function AppFeedbackPage({ app, appSlug }: Props) {
	return (
		<Container size="2" className="feedback-page">
			<Flex align="center" gap="3" mb="2" className="feedback-page__head">
				<span className="feedback-page__icon" aria-hidden>
					<ChatBubbleIcon />
				</span>
				<div>
					<Heading size="8" as="h1" mb="1">
						Feedback
					</Heading>
					<Text as="p" size="4" color="gray">
						{app.appName}
					</Text>
				</div>
			</Flex>

			<Text as="p" size="3" color="gray" mb="6" className="feedback-page__intro">
				Share a bug, idea, or question. Your message helps us improve {app.appName}.
			</Text>

			<Box className="feedback-page__panel">
				<FeedbackForm appSlug={appSlug} appName={app.appName} contactEmail={app.contactEmail} />
			</Box>

			<AppContactCta
				appSlug={appSlug}
				contactEmail={app.contactEmail}
				title="Prefer email?"
				lead="You can also reach us directly at the address below."
				showFeedback={false}
			/>
		</Container>
	)
}
