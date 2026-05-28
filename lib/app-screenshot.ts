import { assetPath } from '@/lib/basePath'
import type { LandingFeatureVisual } from '@/types/landing'

type AppScreenshotSet = {
	phones: string[]
	tablets: string[]
}

const APP_SCREENSHOTS: Record<string, AppScreenshotSet> = {
	rawclinic: {
		phones: [
			'/screenshots/raw-clinic-1.PNG',
			'/screenshots/raw-clinic-2.PNG',
			'/screenshots/raw-clinic-3.PNG'
		],
		tablets: ['/screenshots/raw-clinic-1-ipad.png']
	},
	'aqi-sense': {
		phones: ['/screenshots/aqi-sense-1.PNG', '/screenshots/aqi-sense-2.PNG'],
		tablets: ['/screenshots/aqi-sense-1-ipad.png', '/screenshots/aqi-sense-2-ipad.png']
	}
}

function at<T>(items: T[], index: number): T | undefined {
	if (items.length === 0) return undefined
	const i = ((index % items.length) + items.length) % items.length
	return items[i]
}

function pathAt(items: string[], index: number): string | undefined {
	const path = at(items, index)
	return path ? assetPath(path) : undefined
}

export function getAppPhoneScreenshotPath(slug: string, index = 0): string | undefined {
	return pathAt(APP_SCREENSHOTS[slug]?.phones ?? [], index)
}

export function getAppTabletScreenshotPath(slug: string, index = 0): string | undefined {
	return pathAt(APP_SCREENSHOTS[slug]?.tablets ?? [], index)
}

const FEATURE_PHONE_INDEX: Record<LandingFeatureVisual, number> = {
	editor: 0,
	color: 1,
	shield: 2,
	devices: 2,
	feed: 0,
	map: 1,
	chart: 0,
	settings: 1
}

const FEATURE_TABLET_INDEX: Record<LandingFeatureVisual, number> = {
	editor: 0,
	color: 0,
	shield: 0,
	devices: 0,
	feed: 0,
	map: 1,
	chart: 0,
	settings: 1
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
	const set = APP_SCREENSHOTS[slug]
	if (!set) return {}

	if (variant === 'hero') {
		return {
			phone: pathAt(set.phones, 0),
			phoneSecondary: pathAt(set.phones, 1),
			tablet: pathAt(set.tablets, 0)
		}
	}

	if (variant === 'compact') {
		return {
			phone: pathAt(set.phones, set.phones.length - 1),
			tablet: pathAt(set.tablets, set.tablets.length > 1 ? 1 : 0)
		}
	}

	return {
		phone: pathAt(set.phones, FEATURE_PHONE_INDEX[variant]),
		tablet: pathAt(set.tablets, FEATURE_TABLET_INDEX[variant])
	}
}
