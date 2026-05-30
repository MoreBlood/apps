'use client'

import { ChevronDownIcon } from '@radix-ui/react-icons'
import { Text } from '@radix-ui/themes'
import { useId, useState } from 'react'
import type { FAQItem } from '@/types/faq'

type Props = {
	item: FAQItem
}

export default function FAQAccordionItem({ item }: Props) {
	const [open, setOpen] = useState(false)
	const answerId = useId()

	return (
		<article className={`faq-item${open ? ' faq-item--open' : ''}`} id={item.id}>
			<button
				type="button"
				className="faq-item__question"
				aria-expanded={open}
				aria-controls={answerId}
				onClick={() => setOpen((prev) => !prev)}
			>
				<Text weight="medium" as="span" className="faq-item__label">
					{item.question}
				</Text>
				<ChevronDownIcon className="faq-item__chevron" aria-hidden />
			</button>
			<div className="faq-item__answer-wrap" inert={!open}>
				<div id={answerId} className="faq-item__answer-inner">
					<div className="faq-item__answer">{item.answer}</div>
				</div>
			</div>
		</article>
	)
}
