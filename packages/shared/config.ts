import type { ComponentType } from 'react'
import AQISenseDescriptionContent from '@/components/descriptions/AQISenseDescriptionContent'
import RawClinicDescriptionContent from '@/components/descriptions/RawClinicDescriptionContent'
import AQISensePrivacyContent from '@/components/legal/AQISensePrivacyContent'
import AQISenseTermsContent from '@/components/legal/AQISenseTermsContent'
import RawClinicPrivacyContent from '@/components/legal/RawClinicPrivacyContent'
import RawClinicTermsContent from '@/components/legal/RawClinicTermsContent'
import { getSingleAppSlug, isSingleAppSite } from '@/config/site-mode'

export type PrivacyContentProps = { app: AppConfig }
export type TermsContentProps = { app: AppConfig; appSlug: string }
export type DescriptionContentProps = { app: AppConfig }

/** Radix Theme accent color name (used for Theme accentColor prop; custom hex via data-app-theme in CSS). */
export type RadixAccentColor =
	| 'gray'
	| 'gold'
	| 'bronze'
	| 'brown'
	| 'yellow'
	| 'amber'
	| 'orange'
	| 'tomato'
	| 'red'
	| 'ruby'
	| 'crimson'
	| 'pink'
	| 'plum'
	| 'purple'
	| 'violet'
	| 'iris'
	| 'indigo'
	| 'blue'
	| 'cyan'
	| 'teal'
	| 'jade'
	| 'green'
	| 'grass'
	| 'lime'
	| 'mint'
	| 'sky'

/** Serializable app fields for client landing page components. */
export type LandingAppInfo = {
	slug: string
	appName: string
	tagline: string
	contactEmail: string
	storeLink?: string
}

export function toLandingAppInfo(app: AppConfig): LandingAppInfo {
	return {
		slug: app.slug,
		appName: app.appName,
		tagline: app.tagline,
		contactEmail: app.contactEmail,
		storeLink: app.storeLink
	}
}

export type AppConfig = {
	slug: string
	appName: string
	tagline: string
	description: string
	contactEmail: string
	lastUpdated: string
	/** Web3Forms access key (public client key). */
	web3formsAccessKey?: string
	/** Radix Theme accent color for this app's routes. */
	accentColor: RadixAccentColor
	/** App Store URL. Optional. */
	storeLink?: string
	/** Custom description (About) content. Omit to use default layout. */
	DescriptionContent?: ComponentType<DescriptionContentProps>
	/** Custom privacy policy content. Omit to use default layout. */
	PrivacyContent?: ComponentType<PrivacyContentProps>
	/** Custom terms of service content. Omit to use default layout. */
	TermsContent?: ComponentType<TermsContentProps>
}

const apps: AppConfig[] = [
	{
		slug: 'rawclinic',
		appName: 'RAW Clinic',
		tagline: 'Edit Apple ProRAW on iPhone',
		description:
			"Apple Pro RAW is not dead: develop ProRAW on device, dial back Deep Fusion's baked-in look, and finish photos without a PC. Shoot with Apple Camera, grade in a focused queue, and export when ready — free on iPhone and iPad.",
		contactEmail: 'artihovich.it+rawclinic@gmail.com',
		lastUpdated: 'May 17, 2026',
		web3formsAccessKey: '3bf5de50-6275-4597-adcc-41db5b91d56a',
		storeLink: 'https://apps.apple.com/app/raw-clinic/id6755300857',
		accentColor: 'red',
		DescriptionContent: RawClinicDescriptionContent,
		PrivacyContent: RawClinicPrivacyContent,
		TermsContent: RawClinicTermsContent
	},
	{
		slug: 'aqi-sense',
		appName: 'AQI Sense',
		tagline: 'AQI Sense is an iOS app for checking air quality near you and around the world.',
		description:
			'AQI Sense shows live AQI and pollutant levels from WAQI, Sensor.Community, and OpenSenseMap. Feed with saved and nearby stations, map view with clustering, station details with forecast. Choose data provider and AQI scale (US EPA, China, European CAQI) in Settings.',
		contactEmail: 'artihovich.it+aqisense@gmail.com',
		lastUpdated: 'February 2026',
		web3formsAccessKey: '55fe780b-6bb5-4fb6-ba83-ed222a6199c9',
		storeLink: 'https://apps.apple.com/us/app/aqi-sense/id6759257996',
		accentColor: 'green',
		DescriptionContent: AQISenseDescriptionContent,
		PrivacyContent: AQISensePrivacyContent,
		TermsContent: AQISenseTermsContent
	}
]

export function resolveSiteName(): string {
	const explicit = process.env.SITE_NAME?.trim()
	if (explicit) return explicit
	if (isSingleAppSite()) {
		return getAppBySlug(getSingleAppSlug())?.appName ?? 'RAW Clinic'
	}
	return 'AK Apps'
}

export const siteName = resolveSiteName()

export function getApps(): AppConfig[] {
	if (isSingleAppSite()) {
		const app = getAppBySlug(getSingleAppSlug())
		return app ? [app] : []
	}
	return apps
}

export function getAppBySlug(slug: string): AppConfig | null {
	return apps.find((app) => app.slug === slug) ?? null
}
