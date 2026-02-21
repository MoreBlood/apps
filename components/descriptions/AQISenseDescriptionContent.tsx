import { Strong, Text } from '@radix-ui/themes'
import type { DescriptionContentProps } from '@/config'

export default function AQISenseDescriptionContent({ app }: DescriptionContentProps) {
	return (
		<>
			<Text as="p" mb="2">
				{app.appName} shows live <Strong>AQI</Strong> and pollutant levels from <Strong>WAQI</Strong>, <Strong>Sensor.Community</Strong>, and{' '}
				<Strong>OpenSenseMap</Strong>, so you can pick the data source you prefer.
			</Text>
			<ul>
				<li>
					<Text><Strong>Feed</Strong> — your saved stations and nearby ones in one list; pull to refresh for the latest readings.</Text>
				</li>
				<li>
					<Text><Strong>Map</Strong> — stations on a map with clustering; tap a marker to open station details.</Text>
				</li>
				<li>
					<Text><Strong>Station details</Strong> — current AQI, breakdown by pollutant (PM2.5, PM10, O₃, NO₂, etc.), multi-day forecast
						(O₃, PM10, PM25, UVI), and a small location map.</Text>
				</li>
			</ul>
			<Text as="p" mt="2">
				You can <Strong>search</Strong> by place or keyword to find and favorite stations. In <Strong>Settings</Strong> you choose the data
				provider and the AQI scale: <Strong>US EPA</Strong>, <Strong>China (HJ 633-2012)</Strong>, or <Strong>European CAQI</Strong>. Built with
				SwiftUI and SwiftData; first run includes a short onboarding.
			</Text>
		</>
	)
}
