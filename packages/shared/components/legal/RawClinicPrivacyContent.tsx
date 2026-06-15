import { Box, Container, Heading, Strong, Text } from '@radix-ui/themes'
import ContactEmailLink from '@/components/ContactEmailLink'
import AppLegalHero from '@/components/legal/AppLegalHero'
import type { PrivacyContentProps } from '@/config'

export default function RawClinicPrivacyContent({ app }: PrivacyContentProps) {
	return (
		<Container size="2" className="site-prose">
			<AppLegalHero app={app} title="Privacy Policy" />

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
				<Strong>{app.appName} does not collect, store, or transmit any personal data to us or our servers.</Strong> The
				app operates on your device and does not send your photos, edits, or location to external servers we control.
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
				third parties by the App.
			</Text>

			<Heading size="5" mb="2" as="h2">
				Camera
			</Heading>
			<Text as="p" mb="4">
				If you use the in-app camera, {app.appName} may request access to your device camera to capture photos in RAW
				format. Captured images are processed and stored on your device like any other photo you edit in the App. We do
				not receive copies of images you capture.
			</Text>

			<Heading size="5" mb="2" as="h2">
				Location
			</Heading>
			<Text as="p" mb="4">
				{app.appName} may request access to your device location{' '}
				<Strong>
					only to write geographic coordinates into the metadata of photos you capture with the built-in in-app camera
				</Strong>{' '}
				when you save those photos (for example, EXIF or equivalent embedded location fields). Location is not used for
				advertising, analytics, background tracking, or any purpose other than optional geotagging of photos you take in
				the App. Coordinates remain in the saved image file on your device unless you later share that file yourself
				through other means outside the App.
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
				All data is stored locally on your device and is not transmitted to us.
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
				{app.appName} is suitable for all ages. Since we do not collect any personal information on our servers, there
				are no additional considerations regarding children's use of the app beyond your device's and Apple's policies.
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
				Since we do not operate a cloud service that stores your personal data, there is no account data for you to
				access, modify, or delete on our side. You maintain complete control over your photos, camera, and location
				permissions through iOS Settings, and over any location metadata embedded in files you save from the App.
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
					<ContactEmailLink email={app.contactEmail} />
				</Text>
			</Box>
		</Container>
	)
}
