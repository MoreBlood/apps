import { getLandingBySlug } from '@/config/landing-content'
import { assetPath } from '@/lib/basePath'
import type { LandingFeatureVisual, LandingSectionScreenshots } from '@/types/landing'

function resolveSection(slots: LandingSectionScreenshots | undefined) {
	if (!slots) return {}
	return {
		phone: assetPath(slots.iphone),
		phoneSecondary: slots.iphoneSecondary ? assetPath(slots.iphoneSecondary) : undefined,
		tablet: assetPath(slots.ipad)
	}
}

export function getAppPhoneScreenshotPath(slug: string): string | undefined {
	const iphone = getLandingBySlug(slug)?.screenshots.hero.iphone
	return iphone ? assetPath(iphone) : undefined
}

export function getAppTabletScreenshotPath(slug: string): string | undefined {
	const ipad = getLandingBySlug(slug)?.screenshots.hero.ipad
	return ipad ? assetPath(ipad) : undefined
}

export type LandingStageScreenshotVariant = 'hero' | 'compact' | LandingFeatureVisual

export type LandingStageScreenshots = {
	phone?: string
	phoneSecondary?: string
	tablet?: string
}

export function getLandingStageScreenshots(
	slug: string,
	variant: LandingStageScreenshotVariant
): LandingStageScreenshots {
	const landing = getLandingBySlug(slug)
	if (!landing) return {}

	if (variant === 'hero') {
		return resolveSection(landing.screenshots.hero)
	}

	if (variant === 'compact') {
		return resolveSection(landing.screenshots.closing ?? landing.screenshots.hero)
	}

	const feature = landing.features.find((row) => row.visual === variant)
	return resolveSection(feature?.screenshots)
}
