'use client'

import clsx from 'clsx'
import { useEffect, useState } from 'react'
import OptimizedImage from '@/components/shared/OptimizedImage'
import {
	type FinderImageVariant,
	getComparePairForSlug,
	getFinderImageLabel,
	getFinderImageSrc
} from '@/config/landing-crack-finder'
import { computePreviewLayout, type PreviewLayout } from '@/lib/landing-crack-preview-size'
import type { LandingCrackSkin } from '@/lib/landing-crack-skin'
import { resolveOptimizedImage } from '@/lib/optimized-image'
import CrackWindowFrame from './CrackWindowFrame'
import { useCrackWindowFrame } from './CrackWindowFrameContext'
import { useLandingCrackFinder } from './LandingCrackFinderContext'
import { useLandingCrackShell } from './LandingCrackShellContext'

type Props = {
	appSlug: string
	skin: LandingCrackSkin
}

function PreviewContent({
	skin,
	variant,
	alt,
	src
}: {
	skin: LandingCrackSkin
	variant: FinderImageVariant
	alt: string
	src: string
}) {
	const wm = useLandingCrackShell()
	const finder = useLandingCrackFinder()
	const win = useCrackWindowFrame()
	const { setPanelSize, applyCenteredPlacement, isGeometryCustomized, hasPanelSize } = win
	const isMac = skin === 'mac'
	const [layout, setLayout] = useState<PreviewLayout | null>(null)

	useEffect(() => {
		const meta = resolveOptimizedImage(src)
		const next = computePreviewLayout(meta.width, meta.height)
		setLayout(next)
		if (isGeometryCustomized() || win.wm.getWindowGeometry('preview')) return

		setPanelSize(next.window)
		requestAnimationFrame(() => applyCenteredPlacement(next.window.width, next.window.height))
	}, [src, setPanelSize, applyCenteredPlacement, isGeometryCustomized, win.wm])

	const setVariant = (next: FinderImageVariant) => finder.setPreviewVariant(next)

	return (
		<div
			className={clsx(
				'landing-crack-preview',
				isMac && 'landing-crack-preview--mac',
				hasPanelSize && 'landing-crack-preview--sized'
			)}
		>
			<div className="landing-crack-preview__toggle" role="tablist" aria-label="Compare variant">
				<button
					type="button"
					role="tab"
					className={clsx('landing-crack-preview__tab', variant === 'before' && 'landing-crack-preview__tab--active')}
					aria-selected={variant === 'before'}
					onClick={() => setVariant('before')}
				>
					{isMac ? 'Embedded' : 'Before'}
				</button>
				<button
					type="button"
					role="tab"
					className={clsx('landing-crack-preview__tab', variant === 'after' && 'landing-crack-preview__tab--active')}
					aria-selected={variant === 'after'}
					onClick={() => setVariant('after')}
				>
					{isMac ? 'RAW Clinic' : 'After'}
				</button>
			</div>
			<figure
				className="landing-crack-preview__stage"
				style={layout ? { width: layout.image.width, height: layout.image.height, minHeight: 0 } : undefined}
			>
				{layout && (
					<OptimizedImage
						key={src}
						src={src}
						alt={alt}
						width={layout.image.width}
						height={layout.image.height}
						className="landing-crack-preview__frame"
						imgClassName="landing-crack-preview__img"
						sizes={`${layout.image.width}px`}
					/>
				)}
			</figure>
			<p className="landing-crack-preview__caption">{alt}</p>
			<div className="landing-crack-preview__actions">
				<button
					type="button"
					className="landing-crack-preview__btn"
					onClick={() => {
						wm.activate('finder')
						finder.closePhoto()
					}}
				>
					{isMac ? 'Back to Finder' : '<< Folder'}
				</button>
			</div>
		</div>
	)
}

export default function LandingCrackPhotoViewer({ appSlug, skin }: Props) {
	const finder = useLandingCrackFinder()
	const preview = finder.preview
	const pair = preview ? getComparePairForSlug(appSlug, preview.pairId) : null
	const variant = preview?.variant ?? 'before'
	const src = pair ? getFinderImageSrc(pair, variant) : null
	const isMac = skin === 'mac'

	useEffect(() => {
		if (!preview) return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') finder.closePhoto()
		}
		globalThis.addEventListener('keydown', onKey)
		return () => globalThis.removeEventListener('keydown', onKey)
	}, [finder, preview])

	if (!preview || !pair || !src) return null

	const title = isMac
		? `${getFinderImageLabel(variant, 'mac')} — ${pair.id}`
		: `Preview — ${pair.id} (${variant === 'before' ? 'Before' : 'After'})`

	return (
		<CrackWindowFrame windowId="preview" skin={skin} title={title} className="landing-crack-preview-wrap">
			<PreviewContent skin={skin} variant={variant} alt={pair.alt} src={src} />
		</CrackWindowFrame>
	)
}
