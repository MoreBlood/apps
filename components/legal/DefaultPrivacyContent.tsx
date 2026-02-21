import { Box, Container, Heading, Link, Strong, Text } from '@radix-ui/themes'
import type { PrivacyContentProps } from '@/config'

export default function DefaultPrivacyContent({ app }: PrivacyContentProps) {
	return (
		<Container size="2">
			<Heading size="8" mb="2" as="h1">
				Privacy Policy
			</Heading>
			<Heading size="5" mb="2" as="h2">
				{app.appName}
			</Heading>
			<Text size="1" color="gray" mb="6" style={{ fontStyle: 'italic' }}>
				Last updated: {app.lastUpdated}
			</Text>

			<Heading size="5" mb="2" as="h2">
				Introduction
			</Heading>
			<Text as="p" mb="4">
				Welcome to {app.appName}. We respect your privacy and are committed to protecting your personal data. This
				privacy policy explains how we handle your information when you use our mobile application.
			</Text>

			<Heading size="5" mb="2" as="h2">
				Data Collection
			</Heading>
			<Text as="p" mb="4">
				<Strong>{app.appName} does not collect, store, or transmit any personal data.</Strong>
				{' '}The app operates entirely on your device and does not communicate with external servers.
			</Text>

			<Heading size="5" mb="2" as="h2">
				Photo Access
			</Heading>
			<Text as="p" mb="2">
				{app.appName} requires access to your photo library to:
			</Text>
			<ul>
				<li>
					<Text>Load RAW photo files for editing</Text>
				</li>
				<li>
					<Text>Save edited photos back to your library</Text>
				</li>
			</ul>
			<Text as="p" mb="4">
				All photo processing happens locally on your device. Your photos are never uploaded to any server or shared with
				third parties.
			</Text>

			<Heading size="5" mb="2" as="h2">
				Data Storage
			</Heading>
			<Text as="p" mb="2">
				The app may store:
			</Text>
			<ul>
				<li>
					<Text>User preferences (such as language selection)</Text>
				</li>
				<li>
					<Text>Temporary editing data while you work on a photo</Text>
				</li>
			</ul>
			<Text as="p" mb="4">
				All data is stored locally on your device and is never transmitted externally.
			</Text>

			<Heading size="5" mb="2" as="h2">
				Third-Party Services
			</Heading>
			<Text as="p" mb="4">
				{app.appName} does not integrate with any third-party analytics, advertising, or tracking services. We do not
				share your data with any third parties because we do not collect it in the first place.
			</Text>

			<Heading size="5" mb="2" as="h2">
				iCloud
			</Heading>
			<Text as="p" mb="4">
				If you use iCloud Photos, the app may access photos stored in iCloud through Apple's standard PhotoKit
				framework. This is handled entirely by Apple's systems, and we do not have access to your iCloud credentials or
				data.
			</Text>

			<Heading size="5" mb="2" as="h2">
				Children's Privacy
			</Heading>
			<Text as="p" mb="4">
				{app.appName} is suitable for all ages. Since we do not collect any personal information, there are no
				additional considerations regarding children's use of the app.
			</Text>

			<Heading size="5" mb="2" as="h2">
				Changes to This Policy
			</Heading>
			<Text as="p" mb="4">
				We may update this privacy policy from time to time. We will notify you of any changes by posting the new
				privacy policy in the app and updating the "Last updated" date.
			</Text>

			<Heading size="5" mb="2" as="h2">
				Your Rights
			</Heading>
			<Text as="p" mb="6">
				Since we do not collect any personal data, there is no data for you to access, modify, or delete. You maintain
				complete control over your photos through iOS system settings.
			</Text>

			<Box pt="6" style={{ borderTop: '1px solid var(--gray-a6)' }}>
				<Heading size="5" mb="2" as="h2">
					Contact Us
				</Heading>
				<Text as="p" mb="2">
					If you have any questions about this privacy policy, please contact us at:
				</Text>
				<Text as="p">
					<Strong>Email: </Strong>
					<Link href={`mailto:${app.contactEmail}`}>{app.contactEmail}</Link>
				</Text>
			</Box>
		</Container>
	)
}
