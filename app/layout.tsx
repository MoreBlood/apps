import type { Metadata, Viewport } from 'next'
import Navigation from '@/components/Navigation'
import '@/styles/index.scss'

export const metadata: Metadata = {
	title: 'RAW Clinic',
	description:
		'RAW Clinic - Professional RAW photo editing for iOS. Edit RAW photos directly on your device with 100% local processing and no data collection.'
}

export const viewport: Viewport = {
	colorScheme: 'light dark'
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>
				<Navigation />
				{children}
			</body>
		</html>
	)
}

