'use client'

import clsx from 'clsx'
import { useEffect } from 'react'
import { getReaderDoc } from '@/config/landing-crack-reader'
import type { LandingCrackSkin } from '@/lib/landing-crack-skin'
import CrackWindowFrame from './CrackWindowFrame'
import { useLandingCrackFinder } from './LandingCrackFinderContext'

type Props = {
	appSlug: string
	skin: LandingCrackSkin
}

export default function LandingCrackTextReader({ appSlug, skin }: Props) {
	const finder = useLandingCrackFinder()
	const isMac = skin === 'mac'
	const doc = finder.readerDocId ? getReaderDoc(appSlug, finder.readerDocId) : null

	useEffect(() => {
		if (!doc) return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') finder.closeReader()
		}
		globalThis.addEventListener('keydown', onKey)
		return () => globalThis.removeEventListener('keydown', onKey)
	}, [doc, finder])

	if (!doc) return null

	const title = isMac ? doc.filename : `${doc.filename} — Notepad`

	return (
		<CrackWindowFrame windowId="reader" skin={skin} title={title} className="landing-crack-reader-wrap">
			<div className={clsx('landing-crack-reader', isMac && 'landing-crack-reader--mac')}>
				{doc.title && <p className="landing-crack-reader__head">{doc.title}</p>}
				<pre className="landing-crack-reader__body">{doc.lines.join('\n')}</pre>
				{doc.footnote && <p className="landing-crack-reader__foot">{doc.footnote}</p>}
			</div>
		</CrackWindowFrame>
	)
}
