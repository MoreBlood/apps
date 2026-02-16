import type { DescriptionContentProps } from '@/config'

export default function AQISenseDescriptionContent({ app }: DescriptionContentProps) {
	return (
		<>
			<p>
				{app.appName} shows live <b>AQI</b> and pollutant levels from <b>WAQI</b>, <b>Sensor.Community</b>, and{' '}
				<b>OpenSenseMap</b>, so you can pick the data source you prefer.
			</p>
			<ul>
				<li>
					<b>Feed</b> — your saved stations and nearby ones in one list; pull to refresh for the latest readings.
				</li>
				<li>
					<b>Map</b> — stations on a map with clustering; tap a marker to open station details.
				</li>
				<li>
					<b>Station details</b> — current AQI, breakdown by pollutant (PM2.5, PM10, O₃, NO₂, etc.), multi-day forecast
					(O₃, PM10, PM25, UVI), and a small location map.
				</li>
			</ul>
			<p>
				You can <b>search</b> by place or keyword to find and favorite stations. In <b>Settings</b> you choose the data
				provider and the AQI scale: <b>US EPA</b>, <b>China (HJ 633-2012)</b>, or <b>European CAQI</b>. Built with
				SwiftUI and SwiftData; first run includes a short onboarding.
			</p>
		</>
	)
}
