'use client'

import { createContext, type ReactNode, useContext } from 'react'
import type { useCrackWindow } from './useCrackWindow'

export type CrackWindowFrameContextValue = ReturnType<typeof useCrackWindow>

const CrackWindowFrameContext = createContext<CrackWindowFrameContextValue | null>(null)

export function CrackWindowFrameProvider({
	value,
	children
}: {
	value: CrackWindowFrameContextValue
	children: ReactNode
}) {
	return <CrackWindowFrameContext.Provider value={value}>{children}</CrackWindowFrameContext.Provider>
}

export function useCrackWindowFrame(): CrackWindowFrameContextValue {
	const ctx = useContext(CrackWindowFrameContext)
	if (!ctx) throw new Error('useCrackWindowFrame must be used inside CrackWindowFrame')
	return ctx
}
