import type { Metadata, Viewport } from 'next'
import { getAppBySlug, siteName } from '@/config'
import { getSingleAppSlug, isSingleAppSite } from '@/config/site-mode'
import { assetPath } from '@/lib/basePath'
import { getBaseUrl, getMetadataBase } from '@/lib/siteUrl'

export const appViewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
	colorScheme: 'light dark'
}

const googleVerification = '9OhCZhfOt3p9_KR27LiHqmUcz0QLXssaHC9NKnjjMWY'

export function buildRootMetadata(): Metadata {
	const canonicalBase = getBaseUrl()

	if (isSingleAppSite()) {
		const app = getAppBySlug(getSingleAppSlug())
		const title = app?.appName ?? 'RAW Clinic'
		const description = app?.description
		return {
			metadataBase: getMetadataBase(),
			icons: {
				icon: assetPath('/icons/opt/raw-clinic.webp'),
				apple: assetPath('/icons/opt/raw-clinic.webp')
			},
			verification: { google: googleVerification },
			title,
			description,
			openGraph: {
				title,
				description,
				type: 'website',
				locale: 'en',
				url: `${canonicalBase}/`
			},
			twitter: {
				card: 'summary',
				title,
				description
			}
		}
	}

	return {
		metadataBase: getMetadataBase(),
		icons: {
			icon: assetPath('/icons/opt/raw-clinic.webp'),
			apple: assetPath('/icons/opt/raw-clinic.webp')
		},
		verification: { google: googleVerification },
		title: siteName,
		description: `Mobile applications by ${siteName}.`,
		openGraph: {
			title: siteName,
			description: `Mobile applications by ${siteName}.`,
			type: 'website',
			locale: 'en',
			url: `${canonicalBase}/`
		},
		twitter: {
			card: 'summary',
			title: siteName,
			description: `Mobile applications by ${siteName}.`
		}
	}
}

export function buildRootJsonLd(): object {
	const canonicalBase = getBaseUrl()

	if (isSingleAppSite()) {
		const app = getAppBySlug(getSingleAppSlug())
		return {
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'SoftwareApplication',
					'@id': `${canonicalBase}#app`,
					name: app?.appName ?? 'RAW Clinic',
					applicationCategory: 'PhotographyApplication',
					operatingSystem: 'iOS',
					url: canonicalBase,
					description: app?.description
				},
				{
					'@type': 'WebSite',
					name: app?.appName ?? 'RAW Clinic',
					url: canonicalBase
				}
			]
		}
	}

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': `${canonicalBase}#organization`,
				name: siteName,
				url: canonicalBase
			},
			{
				'@type': 'WebSite',
				name: siteName,
				url: canonicalBase,
				publisher: { '@id': `${canonicalBase}#organization` }
			}
		]
	}
}
