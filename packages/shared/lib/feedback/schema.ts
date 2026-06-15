import { z } from 'zod'
import { FEEDBACK_CATEGORIES } from '@/types/feedback'

export const feedbackFormSchema = z.object({
	category: z.enum(FEEDBACK_CATEGORIES, {
		error: 'Choose a category'
	}),
	email: z
		.string()
		.trim()
		.max(254)
		.refine((value) => value === '' || z.email().safeParse(value).success, {
			message: 'Enter a valid email address'
		})
		.transform((value) => (value === '' ? undefined : value)),
	message: z
		.string()
		.trim()
		.min(10, 'Please write at least 10 characters')
		.max(5000, 'Message is too long (max 5000 characters)')
})

export type FeedbackFormValues = z.input<typeof feedbackFormSchema>
export type FeedbackFormData = z.output<typeof feedbackFormSchema>

export const FEEDBACK_CATEGORY_LABELS: Record<
	(typeof FEEDBACK_CATEGORIES)[number],
	{ label: string; description: string }
> = {
	bug: {
		label: 'Bug report',
		description: 'Something is broken or not working as expected'
	},
	feature: {
		label: 'Feature idea',
		description: 'Suggest an improvement or new capability'
	},
	question: {
		label: 'Question',
		description: 'Help with using the app or understanding something'
	},
	other: {
		label: 'Other',
		description: 'General thoughts, praise, or anything else'
	}
}
