import { Text } from '@radix-ui/themes'

interface DescriptionTextProps {
	text: string
	as?: 'p' | 'span'
}

function splitParagraphs(text: string): string[] {
	return text
		.split(/\n\n+/)
		.map((s) => s.trim())
		.filter(Boolean)
}

export default function DescriptionText({ text, as: Wrapper = 'p' }: DescriptionTextProps) {
	const paragraphs = splitParagraphs(text)
	if (paragraphs.length === 0) return null
	if (paragraphs.length === 1) {
		return <Text as={Wrapper}>{paragraphs[0]}</Text>
	}
	return (
		<>
			{paragraphs.map((paragraph, i) => (
				<Text key={`${i}-${paragraph.slice(0, 12)}`} as={Wrapper}>
					{paragraph}
				</Text>
			))}
		</>
	)
}
