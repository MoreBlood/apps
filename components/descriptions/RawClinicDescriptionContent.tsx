import { Strong, Text } from '@radix-ui/themes'
import type { DescriptionContentProps } from '@/config'

export default function RawClinicDescriptionContent({ app }: DescriptionContentProps) {
	return (
		<>
			<Text as="p" mb="2">
				{app.appName} is a powerful mobile application for editing <Strong>RAW</Strong> photo files directly on your iOS device.
				All processing happens locally on your device, ensuring your photos remain private and secure.
			</Text>
			<ul>
				<li><Text>Edit RAW photos with professional tools</Text></li>
				<li>
					<Text><Strong>100% local processing</Strong> — no data collection</Text>
				</li>
				<li><Text>Support for various RAW formats</Text></li>
				<li><Text>Save edited photos to your library</Text></li>
			</ul>
		</>
	)
}
