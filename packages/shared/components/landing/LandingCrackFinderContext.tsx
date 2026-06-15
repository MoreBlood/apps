'use client'

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import type { FinderImageVariant } from '@/config/landing-crack-finder'
import {
	INITIAL_FINDER_PATH,
	INITIAL_PREVIEW_PAIR_ID,
	INITIAL_PREVIEW_VARIANT,
	INITIAL_READER_DOC_ID
} from '@/config/landing-crack-initial-desktop'
import { useLandingCrackShell } from './LandingCrackShellContext'

export type CrackPreviewState = {
	pairId: string
	variant: FinderImageVariant
} | null

type FinderNav = {
	path: string
	preview: CrackPreviewState
	readerDocId: string | null
	openFinder: (path?: string) => void
	navigate: (path: string) => void
	openPhoto: (pairId: string, variant?: FinderImageVariant) => void
	setPreviewVariant: (variant: FinderImageVariant) => void
	closePhoto: () => void
	openReader: (docId: string) => void
	closeReader: () => void
}

const LandingCrackFinderContext = createContext<FinderNav | null>(null)

export function LandingCrackFinderProvider({ children }: { children: ReactNode }) {
	const wm = useLandingCrackShell()
	const [path, setPath] = useState(INITIAL_FINDER_PATH)
	const [preview, setPreview] = useState<CrackPreviewState>({
		pairId: INITIAL_PREVIEW_PAIR_ID,
		variant: INITIAL_PREVIEW_VARIANT
	})
	const [readerDocId, setReaderDocId] = useState<string | null>(INITIAL_READER_DOC_ID)

	const openFinder = useCallback(
		(nextPath = '/') => {
			setPath(nextPath)
			wm.openWindow('finder')
		},
		[wm]
	)

	const navigate = useCallback((nextPath: string) => {
		setPath(nextPath)
	}, [])

	const openPhoto = useCallback(
		(pairId: string, variant: FinderImageVariant = 'before') => {
			setPreview({ pairId, variant })
			wm.openWindow('preview')
		},
		[wm]
	)

	const setPreviewVariant = useCallback((variant: FinderImageVariant) => {
		setPreview((prev) => (prev ? { ...prev, variant } : prev))
	}, [])

	const closePhoto = useCallback(() => {
		setPreview(null)
		wm.setChrome('preview', 'closed')
	}, [wm])

	const openReader = useCallback(
		(docId: string) => {
			setReaderDocId(docId)
			wm.openWindow('reader')
		},
		[wm]
	)

	const closeReader = useCallback(() => {
		setReaderDocId(null)
		wm.setChrome('reader', 'closed')
	}, [wm])

	const value = useMemo(
		() => ({
			path,
			preview,
			readerDocId,
			openFinder,
			navigate,
			openPhoto,
			setPreviewVariant,
			closePhoto,
			openReader,
			closeReader
		}),
		[
			path,
			preview,
			readerDocId,
			openFinder,
			navigate,
			openPhoto,
			setPreviewVariant,
			closePhoto,
			openReader,
			closeReader
		]
	)

	return <LandingCrackFinderContext.Provider value={value}>{children}</LandingCrackFinderContext.Provider>
}

export function useLandingCrackFinder(): FinderNav {
	const ctx = useContext(LandingCrackFinderContext)
	if (!ctx) throw new Error('useLandingCrackFinder must be used within LandingCrackFinderProvider')
	return ctx
}
