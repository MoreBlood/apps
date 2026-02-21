import type { Metadata, Viewport } from 'next'
import { Flex } from '@radix-ui/themes'
import AppFooter from '@/components/AppFooter'
import AppNav from '@/components/AppNav'
import ThemeProvider from '@/components/ThemeProvider'
import { siteName } from '@/config'
import 'modern-normalize/modern-normalize.css'
import '@radix-ui/themes/styles.css'
import '@/styles/index.scss'

const siteUrl =
	typeof process.env.NEXT_PUBLIC_SITE_URL === 'string' && process.env.NEXT_PUBLIC_SITE_URL
		? process.env.NEXT_PUBLIC_SITE_URL
		: 'https://example.com'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const canonicalBase = `${siteUrl.replace(/\/$/, '')}${basePath ? `/${basePath.replace(/^\/|\/$/g, '')}` : ''}`

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: siteName,
	description: `Mobile applications by ${siteName}.`,
	openGraph: {
		title: siteName,
		description: `Mobile applications by ${siteName}.`,
		type: 'website',
		locale: 'en'
	},
	twitter: {
		card: 'summary',
		title: siteName,
		description: `Mobile applications by ${siteName}.`
	}
}

export const viewport: Viewport = {
	colorScheme: 'light dark'
}

const jsonLd = {
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'Organization',
			'@id': `${canonicalBase}#organization`,
			name: siteName,
			url: canonicalBase
		},
		{
			'@type': 'WebSite',
			name: siteName,
			url: canonicalBase,
			publisher: { '@id': `${canonicalBase}#organization` }
		}
	]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD for SEO/AI
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
				<ThemeProvider>
					<a href="#main-content" className="skip-link">
						Skip to main content
					</a>
					<Flex
						direction="column"
						px="4"
						py="4"
						style={{ minHeight: '100vh', maxWidth: '100%', margin: '0 auto' }}
					>
						<AppNav />
						<Flex asChild direction="column" flexGrow="1">
							{/* biome-ignore lint: stable id required for skip-link target */}
							<main id="main-content">{children}</main>
						</Flex>
						<AppFooter />
					</Flex>
				</ThemeProvider>
			</body>
		</html>
	)
}
