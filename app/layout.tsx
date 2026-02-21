import type { Metadata, Viewport } from 'next'
import { Flex } from '@radix-ui/themes'
import AppFooter from '@/components/AppFooter'
import AppNav from '@/components/AppNav'
import ThemeProvider from '@/components/ThemeProvider'
import { siteName } from '@/config'
import 'modern-normalize/modern-normalize.css'
import '@radix-ui/themes/styles.css'
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
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider>
					<Flex
						direction="column"
						px="4"
						py="4"
						style={{ minHeight: '100vh', maxWidth: '100%', margin: '0 auto' }}
					>
						<AppNav />
						<Flex direction="column" flexGrow="1">
							{children}
						</Flex>
						<AppFooter />
					</Flex>
				</ThemeProvider>
			</body>
		</html>
	)
}
