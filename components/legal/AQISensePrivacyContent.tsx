import { Box, Container, Heading, Link, Strong, Text } from '@radix-ui/themes'
import type { PrivacyContentProps } from '@/config'

export default function AQISensePrivacyContent({ app }: PrivacyContentProps) {
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
				<Strong>{app.appName} does not collect, store, or transmit any personal data to our servers.</Strong>
				{' '}The app fetches air quality data from third-party providers (WAQI, Sensor.Community, OpenSenseMap) to display
				readings to you. Your use of those services may be subject to their respective privacy policies.
			</Text>

			<Heading size="5" mb="2" as="h2">
				Location
			</Heading>
			<Text as="p" mb="4">
				{app.appName} may use your device location to show air quality stations near you and to sort the feed by
				proximity. Location is used only on your device or sent to the data providers you choose (e.g. to request nearby
				stations). We do not collect or store your location on our own servers.
			</Text>

			<Heading size="5" mb="2" as="h2">
				Data Storage
			</Heading>
			<Text as="p" mb="2">
				The app may store locally on your device:
			</Text>
			<ul>
				<li><Text>Your saved and favorite stations</Text></li>
				<li><Text>Settings (data provider, AQI scale, preferences)</Text></li>
			</ul>
			<Text as="p" mb="4">
				This data stays on your device and is not transmitted to us.
			</Text>

			<Heading size="5" mb="2" as="h2">
				Third-Party Data Sources
			</Heading>
			<Text as="p" mb="4">
				Air quality data is provided by WAQI, Sensor.Community, and OpenSenseMap. When the app requests data from these
				providers, their terms and privacy policies apply to that data flow. We do not control and are not responsible
				for their practices.
			</Text>

			<Heading size="5" mb="2" as="h2">
				Analytics and Tracking
			</Heading>
			<Text as="p" mb="4">
				{app.appName} does not integrate with third-party analytics, advertising, or tracking services. We do not share
				your data with any third parties for marketing purposes.
			</Text>

			<Heading size="5" mb="2" as="h2">
				Children's Privacy
			</Heading>
			<Text as="p" mb="4">
				{app.appName} is suitable for all ages. We do not knowingly collect personal information from children.
			</Text>

			<Heading size="5" mb="2" as="h2">
				Changes to This Policy
			</Heading>
			<Text as="p" mb="4">
				We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy
				in the app and updating the "Last updated" date.
			</Text>

			<Heading size="5" mb="2" as="h2">
				Your Rights
			</Heading>
			<Text as="p" mb="6">
				Since we do not collect personal data on our servers, there is no data held by us for you to access, modify, or
				delete. You can manage location access and delete the app and its local data at any time via iOS settings.
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
