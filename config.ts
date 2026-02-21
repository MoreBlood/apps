import type { ComponentType } from 'react'
import AQISenseDescriptionContent from '@/components/descriptions/AQISenseDescriptionContent'
import RawClinicDescriptionContent from '@/components/descriptions/RawClinicDescriptionContent'
import AQISensePrivacyContent from '@/components/legal/AQISensePrivacyContent'
import AQISenseTermsContent from '@/components/legal/AQISenseTermsContent'

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

export type AppConfig = {
	slug: string
	appName: string
	tagline: string
	description: string
	contactEmail: string
	lastUpdated: string
	feedbackFormUrl: string
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
		tagline: 'Professional RAW photo editing for iOS',
		description:
			'RAW Clinic is a powerful mobile application for editing RAW photo files directly on your iOS device. All processing happens locally on your device, ensuring your photos remain private and secure.',
		contactEmail: 'artihovich.it+rawclinic@gmail.com',
		lastUpdated: 'November 26, 2025',
		feedbackFormUrl:
			'https://docs.google.com/forms/d/e/1FAIpQLSfddrmPd8al4Gnbs8gezfCQ-zna6U1ZIE2tpBH1WWLHwxoxqg/viewform?embedded=true',
		storeLink: 'https://apps.apple.com/app/raw-clinic/id6755300857',
		accentColor: 'red',
		DescriptionContent: RawClinicDescriptionContent
	},
	{
		slug: 'aqi-sense',
		appName: 'AQI Sense',
		tagline: 'AQI Sense is an iOS app for checking air quality near you and around the world.',
		description:
			'AQI Sense shows live AQI and pollutant levels from WAQI, Sensor.Community, and OpenSenseMap. Feed with saved and nearby stations, map view with clustering, station details with forecast. Choose data provider and AQI scale (US EPA, China, European CAQI) in Settings.',
		contactEmail: 'artihovich.it+aqisense@gmail.com',
		lastUpdated: 'February 2026',
		feedbackFormUrl:
			'https://docs.google.com/forms/d/e/1FAIpQLSdU8Zo2oFgkXz8I3weouoeViQzUI-Sig2GgbTDVIjhiyV1U4Q/viewform?usp=publish-editor',
		accentColor: 'green',
		DescriptionContent: AQISenseDescriptionContent,
		PrivacyContent: AQISensePrivacyContent,
		TermsContent: AQISenseTermsContent
	}
]

export const siteName = 'Artihovich Apps'

export function getApps(): AppConfig[] {
	return apps
}

export function getAppBySlug(slug: string): AppConfig | null {
	return apps.find((app) => app.slug === slug) ?? null
}
