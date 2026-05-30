import { Strong, Text } from '@radix-ui/themes'
import type { DescriptionContentProps } from '@/config'

export default function RawClinicDescriptionContent({ app }: DescriptionContentProps) {
	return (
		<>
			<Text as="p" mb="2">
				{app.appName} is a simpler way to edit <Strong>Apple ProRAW</Strong> on iPhone and iPad — without a laptop. Dial
				back what Deep Fusion baked into the preview, grade in a focused queue, and export when the shot is ready. Free,
				on-device, no account.
			</Text>
			<ul>
				<li>
					<Text>Recommended: shoot ProRAW in Apple Camera, edit here</Text>
				</li>
				<li>
					<Text>Embedded, Balanced, or Neutral develop bases</Text>
				</li>
				<li>
					<Text>Film LUTs, copy-paste grades, persistent queue</Text>
				</li>
				<li>
					<Text>Any RAW format your library supports</Text>
				</li>
			</ul>
		</>
	)
}
