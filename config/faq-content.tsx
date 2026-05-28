import NextLink from 'next/link'
import { Link, Strong, Text } from '@radix-ui/themes'
import type { AppFAQConfig } from '@/types/faq'

export const faqBySlug: Record<string, (appSlug: string) => AppFAQConfig> = {
	rawclinic: (appSlug) => ({
		intro:
			'Answers to common questions about RAW Clinic — editing RAW photos on iOS, privacy, permissions, and troubleshooting.',
		sections: [
			{
				id: 'getting-started',
				title: 'Getting started',
				items: [
					{
						id: 'what-is-raw-clinic',
						question: 'What is RAW Clinic?',
						answer: (
							<Text as="p">
								RAW Clinic is a mobile photo editor for iPhone and iPad that opens and edits RAW camera files directly on
								your device. Adjust exposure, color, and tone with tools tuned for RAW dynamic range — without sending your
								photos to the cloud.
							</Text>
						)
					},
					{
						id: 'supported-devices',
						question: 'Which devices are supported?',
						answer: (
							<Text as="p">
								RAW Clinic runs on iPhone and iPad with a recent version of iOS or iPadOS. Performance is best on devices
								with enough memory for large RAW files; very large files may take longer to preview on older hardware.
							</Text>
						)
					},
					{
						id: 'account-required',
						question: 'Do I need an account?',
						answer: (
							<Text as="p">
								No. RAW Clinic does not require sign-in. Open the app, grant photo access, and start editing files from your
								library.
							</Text>
						)
					},
					{
						id: 'cost',
						question: 'Is RAW Clinic free?',
						answer: (
							<Text as="p">
								RAW Clinic is available on the App Store. Any pricing, in-app purchases, or trials are shown on the store
								listing before you download.
							</Text>
						)
					}
				]
			},
			{
				id: 'editing',
				title: 'RAW files & editing',
				items: [
					{
						id: 'supported-formats',
						question: 'Which RAW formats are supported?',
						answer: (
							<Text as="p">
								RAW Clinic supports common camera RAW formats available through iOS PhotoKit — including DNG and many
								manufacturer RAW types your device can read. If a file appears in Photos as RAW, RAW Clinic can usually open
								it. Proprietary formats your iPhone cannot decode are not supported.
							</Text>
						)
					},
					{
						id: 'nondestructive',
						question: 'Does editing overwrite my original RAW file?',
						answer: (
							<Text as="p">
								Edits are nondestructive. Your original RAW remains in the library; exported results are saved as new
								images when you choose to export. You can experiment without losing the source file.
							</Text>
						)
					},
					{
						id: 'jpeg-heic',
						question: 'Can I edit JPEG or HEIC photos?',
						answer: (
							<Text as="p">
								RAW Clinic is built for RAW workflows. It focuses on RAW files and the extra latitude they provide. For
								standard JPEG or HEIC images, use Photos or another editor — RAW Clinic is optimized for RAW data.
							</Text>
						)
					},
					{
						id: 'offline',
						question: 'Does RAW Clinic work offline?',
						answer: (
							<Text as="p">
								Yes. Once photos are on your device, editing runs entirely locally. No internet connection is required to
								adjust and export images.
							</Text>
						)
					},
					{
						id: 'in-app-camera',
						question: 'Is there a built-in camera?',
						answer: (
							<Text as="p">
								RAW Clinic can capture photos in RAW format using the in-app camera when you grant camera permission.
								Captured images are processed on your device like any other photo you edit in the app.
							</Text>
						)
					}
				]
			},
			{
				id: 'privacy',
				title: 'Privacy & permissions',
				items: [
					{
						id: 'photo-upload',
						question: 'Are my photos uploaded to your servers?',
						answer: (
							<Text as="p">
								No. Processing happens on your device. RAW Clinic does not upload your library to our servers for editing
								or storage. See the{' '}
								<Link asChild>
									<NextLink href={`/${appSlug}/privacy/`}>Privacy Policy</NextLink>
								</Link>{' '}
								for full details.
							</Text>
						)
					},
					{
						id: 'permissions',
						question: 'Which permissions does the app request?',
						answer: (
							<>
								<Text as="p" mb="2">
									RAW Clinic may ask for:
								</Text>
								<ul>
									<li>
										<Text>
											<Strong>Photos</Strong> — to open RAW files and save exports to your library.
										</Text>
									</li>
									<li>
										<Text>
											<Strong>Camera</Strong> — only if you use the in-app RAW camera.
										</Text>
									</li>
									<li>
										<Text>
											<Strong>Location</Strong> — only to embed coordinates in metadata of photos you capture with the
											in-app camera, if you allow it.
										</Text>
									</li>
								</ul>
							</>
						)
					},
					{
						id: 'location-why',
						question: 'Why does RAW Clinic ask for location?',
						answer: (
							<Text as="p">
								Location is optional and used only when you take photos with the built-in camera and want geographic
								coordinates written into the saved file&apos;s metadata (for example EXIF). It is not used for ads, analytics, or
								background tracking.
							</Text>
						)
					}
				]
			},
			{
				id: 'troubleshooting',
				title: 'Troubleshooting',
				items: [
					{
						id: 'missing-raw',
						question: "I don't see my RAW photos in the app",
						answer: (
							<Text as="p">
								Confirm the files are in your Photos library and that RAW Clinic has photo access in iOS Settings. Some
								cloud-only items may need to download first. If Photos shows the image as RAW, try opening it from the same
								album inside RAW Clinic.
							</Text>
						)
					},
					{
						id: 'slow-editing',
						question: 'Editing feels slow on large files',
						answer: (
							<Text as="p">
								RAW files are large and memory-intensive. Close other apps, ensure free storage, and allow previews to finish
								loading before applying heavy adjustments. Newer devices handle big files more smoothly.
							</Text>
						)
					},
					{
						id: 'export-missing',
						question: "My export doesn't appear in Photos",
						answer: (
							<Text as="p">
								Check that RAW Clinic still has permission to add to your library. Look in the album or recents view where
								you chose to save. If the export failed, free up storage and try again.
							</Text>
						)
					},
					{
						id: 'feedback',
						question: 'How do I report a bug or suggest a feature?',
						answer: (
							<Text as="p">
								Use the{' '}
								<Link asChild>
									<NextLink href={`/${appSlug}/feedback/`}>Feedback form</NextLink>
								</Link>{' '}
								or email us at the address below. Screenshots and your iOS version help us reproduce issues faster.
							</Text>
						)
					}
				]
			}
		]
	}),
	'aqi-sense': (appSlug) => ({
		intro:
			'Common questions about AQI Sense — data sources, AQI scales, favorites, map behavior, privacy, and troubleshooting.',
		sections: [
			{
				id: 'getting-started',
				title: 'Getting started',
				items: [
					{
						id: 'what-is-aqi-sense',
						question: 'What is AQI Sense?',
						answer: (
							<Text as="p">
								AQI Sense is an iOS app that shows live air quality index (AQI) and pollutant readings near you and around
								the world. Browse a feed of saved and nearby stations, explore an interactive map, and open detailed
								station pages with forecasts.
							</Text>
						)
					},
					{
						id: 'supported-devices',
						question: 'Which devices are supported?',
						answer: (
							<Text as="p">
								AQI Sense runs on iPhone and iPad with a recent version of iOS or iPadOS. An internet connection is needed
								to fetch live readings; saved favorites remain available offline in the app.
							</Text>
						)
					},
					{
						id: 'account-required',
						question: 'Do I need an account?',
						answer: (
							<Text as="p">
								No account is required. Favorites and preferences are stored locally on your device with SwiftData.
							</Text>
						)
					},
					{
						id: 'cost',
						question: 'Is AQI Sense free?',
						answer: (
							<Text as="p">
								AQI Sense is available on the App Store. Check the listing for current pricing, subscriptions, or trials
								before you download.
							</Text>
						)
					}
				]
			},
			{
				id: 'data',
				title: 'Data & accuracy',
				items: [
					{
						id: 'data-sources',
						question: 'Where does the air quality data come from?',
						answer: (
							<Text as="p">
								AQI Sense reads open data from third-party networks you choose in Settings: WAQI (World Air Quality
								Index), Sensor.Community, and OpenSenseMap. We do not operate the sensors; we display what those providers
								publish.
							</Text>
						)
					},
					{
						id: 'update-frequency',
						question: 'How often is data updated?',
						answer: (
							<Text as="p">
								Update intervals depend on each station and provider — from a few minutes to longer gaps for offline
								sensors. Pull to refresh on the feed or reopen a station to request the latest reading available from the
								source.
							</Text>
						)
					},
					{
						id: 'different-numbers',
						question: 'Why does AQI differ from other apps or websites?',
						answer: (
							<Text as="p">
								AQI is calculated from pollutant concentrations using a scale (US EPA, China HJ 633, European CAQI, etc.).
								Different apps may use different scales, providers, or nearest stations. Pick the provider and scale that
								match how you want to interpret the numbers in Settings.
							</Text>
						)
					},
					{
						id: 'accuracy',
						question: 'How accurate are the readings?',
						answer: (
							<Text as="p">
								Community sensors vary in calibration and placement. Official monitoring stations are usually more
								consistent but may be farther away. Treat readings as indicative — especially for health decisions, rely
								on official sources in your region.
							</Text>
						)
					}
				]
			},
			{
				id: 'providers-scales',
				title: 'Providers & AQI scales',
				items: [
					{
						id: 'provider-differences',
						question: 'What is the difference between WAQI, Sensor.Community, and OpenSenseMap?',
						answer: (
							<>
								<Text as="p" mb="2">
									Each network has different coverage and station types:
								</Text>
								<ul>
									<li>
										<Text>
											<Strong>WAQI</Strong> — broad global index data, strong for cities worldwide.
										</Text>
									</li>
									<li>
										<Text>
											<Strong>Sensor.Community</Strong> — community-operated sensors, often hyperlocal.
										</Text>
									</li>
									<li>
										<Text>
											<Strong>OpenSenseMap</Strong> — open citizen-science sensor map with varied devices.
										</Text>
									</li>
								</ul>
							</>
						)
					},
					{
						id: 'which-scale',
						question: 'Which AQI scale should I use?',
						answer: (
							<Text as="p">
								Use the scale common in your region: US EPA in the United States, China HJ 633-2012 in China, European
								CAQI in much of Europe. The scale changes category breakpoints and labels, not the underlying pollutant
								data from the station.
							</Text>
						)
					},
					{
						id: 'change-settings',
						question: 'Can I change provider or scale later?',
						answer: (
							<Text as="p">
								Yes. Open Settings in the app to switch data provider and AQI scale at any time. Favorites stay saved;
								readings will refresh according to the new provider where data exists.
							</Text>
						)
					}
				]
			},
			{
				id: 'features',
				title: 'Feed, map & favorites',
				items: [
					{
						id: 'favorites',
						question: 'How do I save a favorite station?',
						answer: (
							<Text as="p">
								Open a station&apos;s detail screen and add it to favorites (or use the favorite control on the card, depending
								on your app version). Saved stations appear in your feed for quick access.
							</Text>
						)
					},
					{
						id: 'map-clustering',
						question: 'What does map clustering mean?',
						answer: (
							<Text as="p">
								When many stations are close together, the map groups them into a cluster marker showing a count. Zoom in
								or tap the cluster to split it into individual stations.
							</Text>
						)
					},
					{
						id: 'offline',
						question: 'Does the app work offline?',
						answer: (
							<Text as="p">
								Live AQI requires network access to fetch new measurements. Your saved favorites and cached station
								details may still be browsable offline, but values can be stale until you reconnect and refresh.
							</Text>
						)
					},
					{
						id: 'pollutants',
						question: 'Which pollutants are shown?',
						answer: (
							<Text as="p">
								Station pages show available readings such as PM2.5, PM10, O₃, NO₂, and others depending on the sensor.
								When supported by the provider, you may also see multi-day forecasts for ozone, particulates, and UV index.
							</Text>
						)
					},
					{
						id: 'search',
						question: 'How do I find a station in another city?',
						answer: (
							<Text as="p">
								Use search to look up a place name or keyword, then open stations from the results or map. You can favorite
								any station for your feed regardless of where you are physically located.
							</Text>
						)
					}
				]
			},
			{
				id: 'privacy',
				title: 'Privacy',
				items: [
					{
						id: 'data-collection',
						question: 'What data does AQI Sense collect?',
						answer: (
							<Text as="p">
								Preferences and favorites are stored on your device. For details on analytics, location, and third-party
								services, see the{' '}
								<Link asChild>
									<NextLink href={`/${appSlug}/privacy/`}>Privacy Policy</NextLink>
								</Link>
								.
							</Text>
						)
					},
					{
						id: 'location',
						question: 'Does AQI Sense use my location?',
						answer: (
							<Text as="p">
								The app may request location to show nearby stations on the feed and map. Location is used to improve local
								results, not to sell data. You can control permission in iOS Settings at any time.
							</Text>
						)
					}
				]
			},
			{
				id: 'troubleshooting',
				title: 'Troubleshooting',
				items: [
					{
						id: 'stale-data',
						question: 'A station shows old or missing data',
						answer: (
							<Text as="p">
								The sensor or upstream provider may be offline. Try pull-to-refresh, switch provider in Settings if another
								network covers the area, or check another nearby station.
							</Text>
						)
					},
					{
						id: 'no-nearby',
						question: "Nearby stations aren't showing up",
						answer: (
							<Text as="p">
								Ensure location permission is granted and location services are enabled. Coverage varies by region — rural
								areas may have fewer community sensors. Search manually or zoom the map to find the closest available
								station.
							</Text>
						)
					},
					{
						id: 'empty-map',
						question: 'The map looks empty in my area',
						answer: (
							<Text as="p">
								Some providers have sparse coverage outside major cities. Change the data provider in Settings or search
								for a larger nearby city to find active stations.
							</Text>
						)
					},
					{
						id: 'feedback',
						question: 'How do I report a problem or request a feature?',
						answer: (
							<Text as="p">
								Submit the{' '}
								<Link asChild>
									<NextLink href={`/${appSlug}/feedback/`}>Feedback form</NextLink>
								</Link>{' '}
								or email us below. Include the station name, provider, and a screenshot if something looks wrong.
							</Text>
						)
					}
				]
			}
		]
	})
}

export function getFAQBySlug(slug: string): AppFAQConfig | null {
	const builder = faqBySlug[slug]
	return builder ? builder(slug) : null
}
