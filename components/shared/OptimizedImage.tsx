'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { resolveOptimizedImage } from '@/lib/optimized-image'

type Props = {
	/** Config path, e.g. /screenshots/foo.PNG (with or without basePath). */
	src: string
	alt: string
	className?: string
	imgClassName?: string
	/** Above-the-fold LCP — loads immediately, no defer. */
	priority?: boolean
	fill?: boolean
	width?: number
	height?: number
	sizes?: string
	onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void
}

/**
 * next/image with build-time WebP + blur placeholder (see scripts/generate-image-assets.mjs).
 */
export default function OptimizedImage({
	src,
	alt,
	className,
	imgClassName,
	priority = false,
	fill = false,
	width,
	height,
	sizes = '(max-width: 900px) 100vw, 50vw',
	onLoad
}: Props) {
	const image = resolveOptimizedImage(src)
	const shellClass = clsx('optimized-image', className)
	const placeholderProps = priority
		? { placeholder: 'empty' as const }
		: { placeholder: 'blur' as const, blurDataURL: image.blurDataURL }

	if (fill) {
		return (
			<div className={shellClass}>
				<Image
					src={image.src}
					alt={alt}
					fill
					sizes={sizes}
					className={clsx('optimized-image__img', imgClassName)}
					{...placeholderProps}
					priority={priority}
					loading={priority ? undefined : 'lazy'}
					fetchPriority={priority ? 'high' : 'auto'}
					onLoad={onLoad}
				/>
			</div>
		)
	}

	return (
		<Image
			src={image.src}
			alt={alt}
			width={width ?? image.width}
			height={height ?? image.height}
			sizes={sizes}
			className={clsx('optimized-image__img', imgClassName, className)}
			{...placeholderProps}
			priority={priority}
			loading={priority ? undefined : 'lazy'}
			fetchPriority={priority ? 'high' : 'auto'}
			onLoad={onLoad}
		/>
	)
}
