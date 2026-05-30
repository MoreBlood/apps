'use client'

import { CheckIcon, CopyIcon, EnvelopeClosedIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Box, Button, Callout, Flex, Link, Strong, Text } from '@radix-ui/themes'
import { useCallback, useState } from 'react'
import ContactEmailLink from '@/components/ContactEmailLink'
import { formatFeedbackDraftPreview } from '@/lib/feedback/format-message'
import { buildFeedbackMailto, getFeedbackDraftText } from '@/lib/feedback/mailto'
import type { FeedbackPayload } from '@/types/feedback'

type Props = {
	appName: string
	contactEmail: string
	payload: FeedbackPayload
	onRetry: () => void
}

export default function FeedbackEmailFallback({ appName, contactEmail, payload, onRetry }: Props) {
	const [copied, setCopied] = useState(false)
	const preview = formatFeedbackDraftPreview(payload)
	const fullDraft = getFeedbackDraftText(payload)
	const mailtoHref = buildFeedbackMailto(contactEmail, payload)

	const copyDraft = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(fullDraft)
			setCopied(true)
			window.setTimeout(() => setCopied(false), 2000)
		} catch {
			setCopied(false)
		}
	}, [fullDraft])

	return (
		<div className="feedback-fallback">
			<Callout.Root color="red" size="3" className="feedback-fallback__notice">
				<Callout.Icon>
					<ExclamationTriangleIcon />
				</Callout.Icon>
				<Flex direction="column" gap="1" className="feedback-fallback__notice-body">
					<Text weight="medium">We couldn&apos;t send your feedback</Text>
					<Text size="2" color="gray">
						Your message was not delivered yet. To reach us about {appName}, you still need to send it by email — we
						kept what you wrote so you don&apos;t have to start over.
					</Text>
				</Flex>
			</Callout.Root>

			<Box className="feedback-fallback__steps">
				<Text as="p" size="2" weight="medium" mb="2">
					What to do next
				</Text>
				<ol className="feedback-fallback__steps-list">
					<li>
						<Text size="2">
							Tap <Strong>Send by email</Strong> below.
						</Text>
					</li>
					<li>
						<Text size="2">In your email app, send the message (subject and body are pre-filled).</Text>
					</li>
				</ol>
			</Box>

			<Flex direction="column" gap="3" className="feedback-fallback__actions">
				<Button size="3" asChild>
					<Link href={mailtoHref}>
						<EnvelopeClosedIcon />
						Send by email
					</Link>
				</Button>
				<Text as="p" size="2" color="gray">
					To <ContactEmailLink email={contactEmail} size="2" />
				</Text>
			</Flex>

			<Box className="feedback-fallback__draft-wrap">
				<Flex justify="between" align="center" gap="2" mb="2" wrap="wrap">
					<Text as="span" size="2" weight="medium">
						Your message
					</Text>
					<Button
						type="button"
						variant="soft"
						size="2"
						onClick={() => void copyDraft()}
						aria-label={copied ? 'Copied to clipboard' : 'Copy message to clipboard'}
					>
						{copied ? <CheckIcon /> : <CopyIcon />}
						{copied ? 'Copied' : 'Copy'}
					</Button>
				</Flex>
				<Box className="feedback-fallback__draft" aria-label="Your feedback message">
					<pre>{preview}</pre>
				</Box>
			</Box>

			<Flex justify="start">
				<Button type="button" variant="outline" size="2" color="gray" onClick={onRetry}>
					Try the online form again
				</Button>
			</Flex>
		</div>
	)
}
