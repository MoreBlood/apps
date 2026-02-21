'use client'

import { Theme } from '@radix-ui/themes'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
	return (
		<NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
			<Theme accentColor="blue" grayColor="gray" radius="medium">
				{children}
			</Theme>
		</NextThemesProvider>
	)
}
