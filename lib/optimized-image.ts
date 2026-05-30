import { type ImageAsset, imageAssets } from '@/config/image-assets'
import { assetPath } from '@/lib/basePath'

const FALLBACK_BLUR =
	'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQACEQADAP/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//Z'

/** Strip deploy basePath so keys match config/image-assets. */
export function normalizeImageKey(path: string): string {
	const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
	if (!base) return path
	if (path === base) return '/'
	if (path.startsWith(`${base}/`)) return path.slice(base.length)
	return path
}

export function getImageAsset(sourceKey: string): ImageAsset | null {
	return imageAssets[normalizeImageKey(sourceKey)] ?? null
}

export type ResolvedOptimizedImage = {
	/** Path passed to next/image (includes basePath). */
	src: string
	width: number
	height: number
	blurDataURL: string
	/** Original config path, e.g. /screenshots/foo.PNG */
	sourceKey: string
}

export function resolveOptimizedImage(pathOrKey: string): ResolvedOptimizedImage {
	const sourceKey = normalizeImageKey(pathOrKey)
	const asset = imageAssets[sourceKey]
	if (!asset) {
		return {
			sourceKey,
			src: assetPath(sourceKey),
			width: 769,
			height: 1603,
			blurDataURL: FALLBACK_BLUR
		}
	}
	return {
		sourceKey,
		src: assetPath(asset.src),
		width: asset.width,
		height: asset.height,
		blurDataURL: asset.blurDataURL
	}
}
