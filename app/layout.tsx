import type { Metadata, Viewport } from 'next'
import Navigation from '@/components/Navigation'
import { siteName } from '@/config'
import '@/styles/index.scss'

export const metadata: Metadata = {
	title: siteName,
	description: `Mobile applications by ${siteName}.`
}

export const viewport: Viewport = {
	colorScheme: 'light dark'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<Navigation />
				{children}
			</body>
		</html>
	)
}
