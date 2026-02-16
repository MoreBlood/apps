import type { ComponentType } from 'react'
import AQISenseDescriptionContent from '@/components/descriptions/AQISenseDescriptionContent'
import RawClinicDescriptionContent from '@/components/descriptions/RawClinicDescriptionContent'
import AQISensePrivacyContent from '@/components/legal/AQISensePrivacyContent'
import AQISenseTermsContent from '@/components/legal/AQISenseTermsContent'

export type PrivacyContentProps = { app: AppConfig }
export type TermsContentProps = { app: AppConfig; appSlug: string }
export type DescriptionContentProps = { app: AppConfig }

export type AppConfig = {
	slug: string
	appName: string
	tagline: string
	description: string
	contactEmail: string
	lastUpdated: string
	feedbackFormUrl: string
	/** App Store URL. Optional. */
	storeLink?: string
	/** Custom description (About) content. Omit to use default (description string + optional features). */
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
		DescriptionContent: RawClinicDescriptionContent
	},
	{
		slug: 'aqi-sense',
		appName: 'AQI Sense',
		tagline: 'AQI Sense is an iOS app for checking air quality near you and around the world.',
		description:
			'AQI Sense shows live AQI and pollutant levels from WAQI, Sensor.Community, and OpenSenseMap, so you can pick the data source you prefer.\n\nFeed — your saved stations and nearby ones in one list; pull to refresh for the latest readings.\n\nMap — stations on a map with clustering; tap a marker to open station details.\n\nStation details — current AQI, breakdown by pollutant (PM2.5, PM10, O₃, NO₂, etc.), multi-day forecast (O₃, PM10, PM25, UVI), and a small location map.\n\nSearch by place or keyword to find and favorite stations. In Settings you choose the data provider and the AQI scale: US EPA, China (HJ 633-2012), or European CAQI. Built with SwiftUI and SwiftData; first run includes a short onboarding.',
		contactEmail: 'artihovich.it+aqisense@gmail.com',
		lastUpdated: 'February 2026',
		feedbackFormUrl:
			'https://docs.google.com/forms/d/e/1FAIpQLSdU8Zo2oFgkXz8I3weouoeViQzUI-Sig2GgbTDVIjhiyV1U4Q/viewform?usp=publish-editor',
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
