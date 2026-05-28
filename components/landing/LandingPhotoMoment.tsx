'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { assetPath } from '@/lib/basePath'
import { getCompareImageBlur } from '@/lib/compare-image-blur'
import { getComparePairs } from '@/config/compare-content'
import type { LandingPhotoMoment as LandingPhotoMomentConfig } from '@/types/landing'
import LandingCompareCarousel from './LandingCompareCarousel'
import { LandingReveal } from './LandingReveal'

type Props = {
	moment: LandingPhotoMomentConfig
}

function PhotoFrame({
	src,
	alt,
	label,
	compareLabel,
	className
}: {
	src?: string
	alt: string
	label: string
	compareLabel?: string
	className?: string
}) {
	if (src) {
		return (
			<figure className={clsx('landing-photo__figure', className)}>
				<div className="landing-photo__frame">
					<Image
						src={assetPath(src)}
						alt={alt}
						fill
						sizes="(max-width: 900px) 100vw, 50vw"
						className="landing-photo__img"
						placeholder="blur"
						blurDataURL={getCompareImageBlur(src)}
					/>
				</div>
				{compareLabel && (
					<figcaption className="landing-photo__compare-label">{compareLabel}</figcaption>
				)}
			</figure>
		)
	}

	return (
		<div
			className={clsx('landing-photo__frame', 'landing-photo__frame--placeholder', className)}
			role="img"
			aria-label={`${label} — photo placeholder`}
		>
			<span className="landing-photo__placeholder-icon" aria-hidden />
			<span className="landing-photo__placeholder-label">Photo</span>
			<span className="landing-photo__placeholder-id">{label}</span>
		</div>
	)
}

export default function LandingPhotoMoment({ moment }: Props) {
	const alt = moment.alt ?? moment.caption
	const primarySrc = moment.src
	const secondarySrc = moment.srcSecondary

	if (moment.layout === 'spotlight') {
		const comparePairs = moment.compareSet ? getComparePairs(moment.compareSet) : []
		const useCarousel = comparePairs.length > 0

		const hasIntro = Boolean(moment.eyebrow || moment.title || moment.caption)

		return (
			<LandingReveal as="section" className="landing-photo landing-photo--spotlight" duration={0.7}>
				{hasIntro && (
					<header className="landing-photo__intro">
						{moment.eyebrow && <p className="landing-photo__eyebrow">{moment.eyebrow}</p>}
						{moment.title && <h2 className="landing-photo__title">{moment.title}</h2>}
						{moment.caption && <p className="landing-photo__caption">{moment.caption}</p>}
					</header>
				)}
				{useCarousel ? (
					<LandingCompareCarousel
						pairs={comparePairs}
						labels={
							moment.compareLabels ?? {
								primary: 'Embedded JPEG',
								secondary: 'RAW Clinic'
							}
						}
						intervalMs={moment.compareIntervalMs}
					/>
				) : (
					<div className="landing-photo__spotlight-grid">
						<PhotoFrame
							src={primarySrc}
							alt={alt}
							label={`${moment.id} · left`}
							compareLabel={moment.compareLabels?.primary}
						/>
						<PhotoFrame
							src={secondarySrc}
							alt={alt}
							label={`${moment.id} · right`}
							compareLabel={moment.compareLabels?.secondary}
							className="landing-photo__figure--secondary"
						/>
					</div>
				)}
			</LandingReveal>
		)
	}

	if (moment.layout === 'cinema') {
		return (
			<LandingReveal as="section" className="landing-photo landing-photo--cinema" duration={0.75}>
				<div className="landing-photo__cinema-inner">
					{moment.eyebrow && <p className="landing-photo__eyebrow">{moment.eyebrow}</p>}
					<PhotoFrame
						src={primarySrc}
						alt={alt}
						label={moment.id}
						className="landing-photo__frame--cinema"
					/>
					<div className="landing-photo__caption-block">
						{moment.title && <h2 className="landing-photo__title">{moment.title}</h2>}
						<p className="landing-photo__caption">{moment.caption}</p>
					</div>
				</div>
			</LandingReveal>
		)
	}

	// split
	return (
		<LandingReveal as="section" className="landing-photo landing-photo--split" duration={0.7}>
			<div className="landing-photo__split-grid">
				<div className="landing-photo__split-copy">
					{moment.eyebrow && <p className="landing-photo__eyebrow">{moment.eyebrow}</p>}
					{moment.title && <h2 className="landing-photo__title">{moment.title}</h2>}
					<p className="landing-photo__caption">{moment.caption}</p>
				</div>
				<PhotoFrame src={primarySrc} alt={alt} label={moment.id} className="landing-photo__frame--split" />
			</div>
		</LandingReveal>
	)
}
