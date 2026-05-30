'use client'

import { Theme } from '@radix-ui/themes'
import { usePathname } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { getAppThemeMeta, resolveThemeAccent } from '@/config/app-theme'
import { getAppSlugFromPathname } from '@/lib/site-paths'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const appSlug = getAppSlugFromPathname(pathname)
	const app = appSlug ? getAppThemeMeta(appSlug) : null
	const accentColor = resolveThemeAccent(pathname)
	const appTheme = app?.slug

	return (
		<NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
			<Theme accentColor={accentColor} grayColor="gray" radius="medium">
				<div data-app-theme={appTheme}>{children}</div>
			</Theme>
		</NextThemesProvider>
	)
}
