'use client'

import { createContext, type ReactNode, useContext } from 'react'
import { type CrackWindowId, useCrackWindowStack } from '@/lib/landing-crack-window-stack'

type ShellContextValue = {
	focusWindow: (id: CrackWindowId) => void
	getWindowZIndex: (id: CrackWindowId, dragging?: boolean) => number
	isWindowFocused: (id: CrackWindowId) => boolean
}

const LandingCrackShellContext = createContext<ShellContextValue | null>(null)

export function LandingCrackShellProvider({ children }: { children: ReactNode }) {
	const { focusWindow, getWindowZIndex, isWindowFocused } = useCrackWindowStack()

	return (
		<LandingCrackShellContext.Provider value={{ focusWindow, getWindowZIndex, isWindowFocused }}>
			{children}
		</LandingCrackShellContext.Provider>
	)
}

export function useLandingCrackShell() {
	const ctx = useContext(LandingCrackShellContext)
	if (!ctx) throw new Error('useLandingCrackShell must be used within LandingCrackShellProvider')
	return ctx
}
