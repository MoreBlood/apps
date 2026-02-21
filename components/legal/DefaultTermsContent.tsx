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

export default function DefaultTermsContent({ app, appSlug }: TermsContentProps) {
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
				<li><Text>All photos and content you process through the App</Text></li>
				<li><Text>Backing up your photos before editing</Text></li>
				<li><Text>Complying with all applicable laws when using the App</Text></li>
			</ul>

			<Heading size="5" mb="2" as="h2">
				4. Intellectual Property
			</Heading>
			<Text as="p" mb="2">
				<Strong>Your Content:</Strong> You retain all rights to photos and content you create or edit using the App. We
				do not claim any ownership rights to your content.
			</Text>
			<Text as="p" mb="4">
				<Strong>Our Content:</Strong> The App itself, including its code, design, features, and documentation, is
				protected by copyright and other intellectual property laws. You may not copy, modify, distribute, or
				reverse-engineer the App.
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
				<li><Text>Loss or corruption of photos or data</Text></li>
				<li><Text>Device performance issues</Text></li>
				<li><Text>Any damages arising from use or inability to use the App</Text></li>
				<li><Text>Results of photo editing operations</Text></li>
			</ul>
			<Text as="p" mb="4">
				<Strong>We strongly recommend backing up your photos before editing them.</Strong>
			</Text>

			<Heading size="5" mb="2" as="h2">
				6. Photo Editing
			</Heading>
			<Text as="p" mb="2">
				The App provides tools for editing RAW photos. The quality and results of edits depend on:
			</Text>
			<ul>
				<li><Text>The quality and format of the original photo</Text></li>
				<li><Text>Your device's capabilities</Text></li>
				<li><Text>The settings and adjustments you apply</Text></li>
			</ul>
			<Text as="p" mb="4">
				We do not guarantee any specific results from photo editing operations.
			</Text>

			<Heading size="5" mb="2" as="h2">
				7. Privacy
			</Heading>
			<Text as="p" mb="4">
				Your use of the App is also governed by our{' '}
				<Link asChild><NextLink href={`/${appSlug}/privacy`}>Privacy Policy</NextLink></Link>, which explains how we handle your information
				(spoiler: we don't collect any personal data).
			</Text>

			<Heading size="5" mb="2" as="h2">
				8. Updates and Changes
			</Heading>
			<Text as="p" mb="4">
				We may update the App from time to time to add features, fix bugs, or improve performance. We may also modify
				these Terms of Service. Continued use of the App after updates constitutes acceptance of any changes.
			</Text>

			<Heading size="5" mb="2" as="h2">
				9. Termination
			</Heading>
			<Text as="p" mb="4">
				You may stop using the App at any time by deleting it from your device. We reserve the right to terminate or
				restrict access to the App for any reason, including violation of these terms.
			</Text>

			<Heading size="5" mb="2" as="h2">
				10. Third-Party Content
			</Heading>
			<Text as="p" mb="4">
				The App may allow you to import third-party content such as LUT files. You are responsible for ensuring you have
				the right to use any third-party content with the App.
			</Text>

			<Heading size="5" mb="2" as="h2">
				11. Apple App Store
			</Heading>
			<Text as="p" mb="4">
				Your use of the App is also subject to Apple's App Store Terms of Service. In case of conflict between these
				terms and Apple's terms, Apple's terms take precedence.
			</Text>

			<Heading size="5" mb="2" as="h2">
				12. Governing Law
			</Heading>
			<Text as="p" mb="4">
				These Terms of Service are governed by the laws of your jurisdiction. Any disputes shall be resolved in
				accordance with applicable local laws.
			</Text>

			<Heading size="5" mb="2" as="h2">
				13. Severability
			</Heading>
			<Text as="p" mb="4">
				If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force
				and effect.
			</Text>

			<Heading size="5" mb="2" as="h2">
				14. Entire Agreement
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
