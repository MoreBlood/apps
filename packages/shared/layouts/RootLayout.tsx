import { Flex } from '@radix-ui/themes'
import AppFooter from '@/components/AppFooter'
import AppNav from '@/components/AppNav'
import LandingCriticalStyles from '@/components/landing/LandingCriticalStyles'
import ThemeProvider from '@/components/ThemeProvider'
import { appViewport, buildRootJsonLd, buildRootMetadata } from '@/lib/site-metadata'
import 'modern-normalize/modern-normalize.css'
import '@radix-ui/themes/styles.css'
import '@/styles/index.scss'

export const metadata = buildRootMetadata()
export const viewport = appViewport

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const jsonLd = buildRootJsonLd()

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
					<Flex direction="column" className="app-shell">
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
