'use client'

import { createContext, type ReactNode, useContext } from 'react'
import { type CrackWindowManager, useCrackWindowManager } from '@/lib/landing-crack-window-manager'
import { LandingCrackFinderProvider } from './LandingCrackFinderContext'

const LandingCrackShellContext = createContext<CrackWindowManager | null>(null)

export function LandingCrackShellProvider({ children }: { children: ReactNode }) {
	const manager = useCrackWindowManager()

	return (
		<LandingCrackShellContext.Provider value={manager}>
			<LandingCrackFinderProvider>{children}</LandingCrackFinderProvider>
		</LandingCrackShellContext.Provider>
	)
}

export function useLandingCrackShell(): CrackWindowManager {
	const ctx = useContext(LandingCrackShellContext)
	if (!ctx) throw new Error('useLandingCrackShell must be used within LandingCrackShellProvider')
	return ctx
}
