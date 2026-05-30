import type { ReactNode } from 'react'

/** A single question and answer pair. Use `id` for stable keys and deep links. */
export type FAQItem = {
	id: string
	question: string
	/** Plain text or rich content. Keep answers concise; link out to legal pages when needed. */
	answer: ReactNode
}

/** Groups related questions under a heading (e.g. "Getting started", "Privacy"). */
export type FAQSection = {
	id: string
	title: string
	items: FAQItem[]
}

export type AppFAQConfig = {
	/** Optional lead paragraph shown below the page title. */
	intro?: string
	sections: FAQSection[]
}
