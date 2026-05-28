'use client'

import {
	ChatBubbleIcon,
	EnvelopeClosedIcon,
	ExclamationTriangleIcon,
	LightningBoltIcon,
	QuestionMarkCircledIcon
} from '@radix-ui/react-icons'
import {
	Box,
	Button,
	Callout,
	Flex,
	RadioCards,
	Text,
	TextArea,
	TextField
} from '@radix-ui/themes'
import { useEffect, useId, useState } from 'react'
import FeedbackEmailFallback from '@/components/feedback/FeedbackEmailFallback'
import { isFeedbackDebugFailFromEnv, isFeedbackDebugFailFromUrl } from '@/lib/feedback/debug'
import { getFeedbackProvider } from '@/lib/feedback/get-provider'
import {
	FEEDBACK_CATEGORY_LABELS,
	feedbackFormSchema,
	type FeedbackFormValues
} from '@/lib/feedback/schema'
import type { FeedbackCategory, FeedbackPayload } from '@/types/feedback'

type Props = {
	appSlug: string
	appName: string
	contactEmail: string
}

type FieldErrors = Partial<Record<keyof FeedbackFormValues, string>>

const CATEGORY_ICONS: Record<FeedbackCategory, typeof ExclamationTriangleIcon> = {
	bug: ExclamationTriangleIcon,
	feature: LightningBoltIcon,
	question: QuestionMarkCircledIcon,
	other: ChatBubbleIcon
}

const INITIAL_VALUES: FeedbackFormValues = {
	category: 'bug',
	email: '',
	message: ''
}

export default function FeedbackForm({ appSlug, appName, contactEmail }: Props) {
	const formId = useId()
	const [values, setValues] = useState<FeedbackFormValues>(INITIAL_VALUES)
	const [errors, setErrors] = useState<FieldErrors>({})
	const [failedPayload, setFailedPayload] = useState<FeedbackPayload | null>(null)
	const [submitted, setSubmitted] = useState(false)
	const [pending, setPending] = useState(false)
	const [urlDebugFail, setUrlDebugFail] = useState(false)
	const debugFail = isFeedbackDebugFailFromEnv() || urlDebugFail

	useEffect(() => {
		setUrlDebugFail(isFeedbackDebugFailFromUrl())
	}, [])

	const update =
		<K extends keyof FeedbackFormValues>(key: K, value: FeedbackFormValues[K]) => {
			setValues((prev) => ({ ...prev, [key]: value }))
			setErrors((prev) => ({ ...prev, [key]: undefined }))
		}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const parsed = feedbackFormSchema.safeParse(values)
		if (!parsed.success) {
			const nextErrors: FieldErrors = {}
			for (const issue of parsed.error.issues) {
				const field = issue.path[0]
				if (typeof field === 'string' && !(field in nextErrors)) {
					nextErrors[field as keyof FeedbackFormValues] = issue.message
				}
			}
			setErrors(nextErrors)
			return
		}

		setErrors({})
		setPending(true)

		const payload: FeedbackPayload = {
			appSlug,
			appName,
			category: parsed.data.category,
			email: parsed.data.email,
			message: parsed.data.message,
			submittedAt: new Date().toISOString(),
			pageUrl: typeof window !== 'undefined' ? window.location.href : undefined
		}

		const provider = getFeedbackProvider(appSlug, contactEmail)
		const result = await provider.submit(payload)

		setPending(false)

		if (!result.ok) {
			setFailedPayload(payload)
			return
		}

		setSubmitted(true)
	}

	if (failedPayload) {
		return (
			<FeedbackEmailFallback
				appName={appName}
				contactEmail={contactEmail}
				payload={failedPayload}
				onRetry={() => setFailedPayload(null)}
			/>
		)
	}

	if (submitted) {
		return (
			<Callout.Root color="green" size="3" className="feedback-form__success">
				<Callout.Icon>
					<EnvelopeClosedIcon />
				</Callout.Icon>
				<Flex direction="column" gap="1" className="feedback-form__success-body">
					<Text weight="medium">Thanks for your feedback</Text>
					<Text size="2" color="gray">
						We received your message about {appName}. If you left an email, we may follow up when we have
						an update.
					</Text>
				</Flex>
			</Callout.Root>
		)
	}

	return (
		<form
			className="feedback-form"
			onSubmit={handleSubmit}
			noValidate
			autoComplete="on"
			aria-labelledby={`${formId}-title`}
		>
			{debugFail && (
				<Callout.Root color="orange" size="1" mb="4" role="note">
					<Callout.Text>
						Debug: submissions will fail. Remove <code>?feedback_fail=1</code> from the URL or unset{' '}
						<code>NEXT_PUBLIC_FEEDBACK_DEBUG_FAIL</code>.
					</Callout.Text>
				</Callout.Root>
			)}
			<fieldset className="feedback-form__field">
				<legend className="feedback-form__legend">
					<Text as="span" size="2" weight="medium">
						What is this about?
					</Text>
				</legend>
				<RadioCards.Root
					className="feedback-form__categories"
					value={values.category}
					onValueChange={(value) => update('category', value as FeedbackCategory)}
					columns={{ initial: '1', xs: '2' }}
					gap="2"
					size="2"
				>
					{(Object.keys(FEEDBACK_CATEGORY_LABELS) as FeedbackCategory[]).map((category) => {
						const meta = FEEDBACK_CATEGORY_LABELS[category]
						const Icon = CATEGORY_ICONS[category]
						return (
							<RadioCards.Item key={category} value={category} className="feedback-form__category">
								<Flex direction="column" gap="1" align="start">
									<Flex align="center" gap="2">
										<span className="feedback-form__category-icon" aria-hidden>
											<Icon />
										</span>
										<Text weight="medium">{meta.label}</Text>
									</Flex>
									<Text size="1" color="gray">
										{meta.description}
									</Text>
								</Flex>
							</RadioCards.Item>
						)
					})}
				</RadioCards.Root>
				{errors.category && (
					<Text as="p" size="1" color="red" mt="2" role="alert">
						{errors.category}
					</Text>
				)}
			</fieldset>

			<Box className="feedback-form__field">
				<label className="feedback-form__label" htmlFor={`${formId}-email`}>
					<Text as="span" size="2" weight="medium">
						Email
					</Text>
					<Text as="span" size="1" color="gray" ml="2">
						optional — for follow-up
					</Text>
				</label>
				<TextField.Root
					id={`${formId}-email`}
					name="email"
					type="email"
					inputMode="email"
					autoComplete="email"
					autoCapitalize="none"
					autoCorrect="off"
					spellCheck={false}
					placeholder="you@example.com"
					value={values.email}
					onChange={(event) => update('email', event.target.value)}
					size="3"
					className="feedback-form__control"
				>
					<TextField.Slot side="left">
						<EnvelopeClosedIcon />
					</TextField.Slot>
				</TextField.Root>
				{errors.email && (
					<Text as="p" size="1" color="red" mt="2" role="alert">
						{errors.email}
					</Text>
				)}
			</Box>

			<Box className="feedback-form__field">
				<label className="feedback-form__label" htmlFor={`${formId}-message`}>
					<Text as="span" size="2" weight="medium">
						Message
					</Text>
				</label>
				<TextArea
					id={`${formId}-message`}
					name="message"
					autoComplete="off"
					placeholder="Describe what happened, what you expected, or what you would like to see…"
					value={values.message}
					onChange={(event) => update('message', event.target.value)}
					rows={7}
					size="3"
					className="feedback-form__control feedback-form__textarea"
					required
				/>
				<Flex justify="between" mt="2">
					{errors.message ? (
						<Text as="p" size="1" color="red" role="alert">
							{errors.message}
						</Text>
					) : (
						<span />
					)}
					<Text as="p" size="1" color="gray" aria-live="polite">
						{values.message.trim().length}/5000
					</Text>
				</Flex>
			</Box>

			<Flex gap="3" align="center" wrap="wrap" className="feedback-form__actions">
				<Button type="submit" size="3" loading={pending} disabled={pending}>
					Send feedback
				</Button>
			</Flex>
		</form>
	)
}
