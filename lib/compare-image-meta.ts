import { compareImageMeta, type CompareImageMeta } from '@/config/compare-image-meta'

export type { CompareImageMeta }

export function getCompareImageMeta(src: string): CompareImageMeta | null {
	return compareImageMeta[src] ?? null
}

export function isCompareImageLandscape(src: string): boolean {
	const meta = getCompareImageMeta(src)
	if (!meta) return false
	return meta.width > meta.height
}
