import { Flex } from '@radix-ui/themes'
import type { Metadata, Viewport } from 'next'
import AppFooter from '@/components/AppFooter'
import AppNav from '@/components/AppNav'
import LandingCriticalStyles from '@/components/landing/LandingCriticalStyles'
import ThemeProvider from '@/components/ThemeProvider'
import { siteName } from '@/config'
import { assetPath } from '@/lib/basePath'
import { getBaseUrl, getMetadataBase } from '@/lib/siteUrl'
import 'modern-normalize/modern-normalize.css'
import '@radix-ui/themes/styles.css'
import '@/styles/index.scss'

const canonicalBase = getBaseUrl()

export const metadata: Metadata = {
	metadataBase: getMetadataBase(),
	icons: {
		icon: assetPath('/icons/opt/raw-clinic.webp'),
		apple: assetPath('/icons/opt/raw-clinic.webp')
	},
	verification: {
		google: '9OhCZhfOt3p9_KR27LiHqmUcz0QLXssaHC9NKnjjMWY'
	},
	title: siteName,
	description: `Mobile applications by ${siteName}.`,
	openGraph: {
		title: siteName,
		description: `Mobile applications by ${siteName}.`,
		type: 'website',
		locale: 'en',
		url: `${canonicalBase}/`
	},
	twitter: {
		card: 'summary',
		title: siteName,
		description: `Mobile applications by ${siteName}.`
	}
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
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
					<LandingCriticalStyles blocks={['navShell']} />
					<a href="#main-content" className="skip-link">
						Skip to main content
					</a>
					<AppNav />
					<Flex
						direction="column"
						className="app-shell"
						style={{
							minHeight: '100vh',
							maxWidth: '100%',
							margin: '0 auto'
						}}
					>
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
