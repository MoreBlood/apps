'use client'

import { usePathname } from 'next/navigation'
import { Theme } from '@radix-ui/themes'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { getAppThemeMeta } from '@/config/app-theme'

const DEFAULT_ACCENT = 'blue' as const

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const segment = pathname?.split('/').filter(Boolean)[0]
	const app = segment ? getAppThemeMeta(segment) : null
	const accentColor = app?.accentColor ?? DEFAULT_ACCENT
	const appTheme = app?.slug

	return (
		<NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
			<Theme accentColor={accentColor} grayColor="gray" radius="medium">
				<div data-app-theme={appTheme}>{children}</div>
			</Theme>
		</NextThemesProvider>
	)
}
