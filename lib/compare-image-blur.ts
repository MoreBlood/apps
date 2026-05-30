import { resolveOptimizedImage } from '@/lib/optimized-image'

/** @deprecated Prefer resolveOptimizedImage — kept for call sites using config paths only. */
export function getCompareImageBlur(src: string): string {
	return resolveOptimizedImage(src).blurDataURL
}
