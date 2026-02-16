interface DescriptionTextProps {
	text: string
	className?: string
	as?: 'p' | 'span'
}

/** Renders description string with paragraph breaks (double newline → separate block). */
export default function DescriptionText({ text, className, as: Wrapper = 'p' }: DescriptionTextProps) {
	const paragraphs = text
		.split(/\n\n+/)
		.map((s) => s.trim())
		.filter(Boolean)

	if (paragraphs.length === 0) return null
	if (paragraphs.length === 1) {
		return <Wrapper className={className}>{paragraphs[0]}</Wrapper>
	}

	return (
		<>
			{paragraphs.map((paragraph, i) => (
				<Wrapper key={`${i}-${paragraph.slice(0, 12)}`} className={className}>
					{paragraph}
				</Wrapper>
			))}
		</>
	)
}
