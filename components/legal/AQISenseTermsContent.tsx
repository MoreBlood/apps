import NextLink from 'next/link'
import {
	Box,
	Callout,
	Container,
	Heading,
	Link,
	Strong,
	Text
} from '@radix-ui/themes'
import type { TermsContentProps } from '@/config'

export default function AQISenseTermsContent({ app, appSlug }: TermsContentProps) {
	return (
		<Container size="2">
			<Heading size="8" mb="2" as="h1">
				Terms of Service
			</Heading>
			<Heading size="5" mb="2" as="h2">
				{app.appName}
			</Heading>
			<Text size="1" color="gray" mb="6" style={{ fontStyle: 'italic' }}>
				Last updated: {app.lastUpdated}
			</Text>

			<Heading size="5" mb="2" as="h2">
				1. Acceptance of Terms
			</Heading>
			<Text as="p" mb="4">
				By downloading, installing, or using {app.appName} ("the App"), you agree to be bound by these Terms of Service.
				If you do not agree to these terms, please do not use the App.
			</Text>

			<Heading size="5" mb="2" as="h2">
				2. License
			</Heading>
			<Text as="p" mb="4">
				We grant you a limited, non-exclusive, non-transferable, revocable license to use {app.appName} for personal,
				non-commercial purposes in accordance with these Terms of Service and applicable laws.
			</Text>

			<Heading size="5" mb="2" as="h2">
				3. User Responsibilities
			</Heading>
			<Text as="p" mb="2">
				You are responsible for:
			</Text>
			<ul>
				<li><Text>Maintaining the security of your device and the App</Text></li>
				<li><Text>Using the App and any air quality information for personal reference only</Text></li>
				<li><Text>Complying with all applicable laws when using the App</Text></li>
			</ul>

			<Heading size="5" mb="2" as="h2">
				4. Intellectual Property
			</Heading>
			<Text as="p" mb="2">
				<Strong>Our Content:</Strong> The App, including its code, design, and documentation, is protected by copyright
				and other intellectual property laws. You may not copy, modify, distribute, or reverse-engineer the App.
			</Text>
			<Text as="p" mb="4">
				Air quality data displayed in the App is provided by third-party sources (e.g. WAQI, Sensor.Community,
				OpenSenseMap). Their data remains subject to their respective terms and licenses.
			</Text>

			<Heading size="5" mb="2" as="h2">
				5. Limitations of Liability
			</Heading>
			<Callout.Root color="amber" mb="4">
				<Callout.Text>
					<Strong>Important:</Strong> {app.appName} is provided "as is" without warranties of any kind.
				</Callout.Text>
			</Callout.Root>
			<Text as="p" mb="2">
				We are not liable for:
			</Text>
			<ul>
				<li><Text>Accuracy, completeness, or timeliness of air quality data (which comes from third parties)</Text></li>
				<li><Text>Decisions you make based on AQI or pollutant readings</Text></li>
				<li><Text>Any damages arising from use or inability to use the App</Text></li>
				<li><Text>Unavailability of third-party data sources</Text></li>
			</ul>
			<Text as="p" mb="4">
				Air quality data is for informational purposes only. Do not rely on it as the sole basis for health or safety
				decisions.
			</Text>

			<Heading size="5" mb="2" as="h2">
				6. Third-Party Data
			</Heading>
			<Text as="p" mb="4">
				The App shows data from WAQI, Sensor.Community, and OpenSenseMap. We do not guarantee availability or accuracy
				of that data. Your use of the App may involve requests to these providers; their terms apply to that use.
			</Text>

			<Heading size="5" mb="2" as="h2">
				7. Privacy
			</Heading>
			<Text as="p" mb="4">
				Your use of the App is also governed by our{' '}
				<Link asChild><NextLink href={`/${appSlug}/privacy`}>Privacy Policy</NextLink></Link>, which explains how we handle your information.
			</Text>

			<Heading size="5" mb="2" as="h2">
				8. Updates and Changes
			</Heading>
			<Text as="p" mb="4">
				We may update the App and these Terms of Service from time to time. Continued use after updates constitutes
				acceptance of the changes.
			</Text>

			<Heading size="5" mb="2" as="h2">
				9. Termination
			</Heading>
			<Text as="p" mb="4">
				You may stop using the App at any time by deleting it from your device. We reserve the right to terminate or
				restrict access for any reason, including violation of these terms.
			</Text>

			<Heading size="5" mb="2" as="h2">
				10. Apple App Store
			</Heading>
			<Text as="p" mb="4">
				Your use of the App is also subject to Apple's App Store Terms of Service. In case of conflict, Apple's terms
				take precedence.
			</Text>

			<Heading size="5" mb="2" as="h2">
				11. Governing Law
			</Heading>
			<Text as="p" mb="4">
				These Terms of Service are governed by the laws of your jurisdiction. Any disputes shall be resolved in
				accordance with applicable local laws.
			</Text>

			<Heading size="5" mb="2" as="h2">
				12. Severability
			</Heading>
			<Text as="p" mb="4">
				If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force
				and effect.
			</Text>

			<Heading size="5" mb="2" as="h2">
				13. Entire Agreement
			</Heading>
			<Text as="p" mb="6">
				These Terms of Service, together with our Privacy Policy, constitute the entire agreement between you and us
				regarding use of the App.
			</Text>

			<Box pt="6" style={{ borderTop: '1px solid var(--gray-a6)' }}>
				<Heading size="5" mb="2" as="h2">
					Contact Us
				</Heading>
				<Text as="p" mb="2">
					If you have any questions about these Terms of Service, please contact us at:
				</Text>
				<Text as="p">
					<Strong>Email: </Strong>
					<Link href={`mailto:${app.contactEmail}`}>{app.contactEmail}</Link>
				</Text>
			</Box>
		</Container>
	)
}
