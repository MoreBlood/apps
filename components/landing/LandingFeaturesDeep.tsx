'use client'

import { Fragment } from 'react'
import type { LandingAppInfo } from '@/config'
import type { AppLandingConfig } from '@/types/landing'
import LandingDeviceStage from './LandingDeviceStage'
import LandingPhotoMoment from './LandingPhotoMoment'

type Props = {
	app: LandingAppInfo
	features: AppLandingConfig['features']
	photoMoments?: AppLandingConfig['photoMoments']
}

function FeatureSection({
	app,
	feature,
	featureIndex
}: {
	app: LandingAppInfo
	feature: AppLandingConfig['features'][number]
	featureIndex: number
}) {
	const reverse = feature.visualOnLeft === true

	return (
		<section className={`landing-feature${reverse ? ' landing-feature--reverse' : ''}`}>
			<div className="landing-feature__content">
				{feature.eyebrow && <p className="landing-feature__eyebrow">{feature.eyebrow}</p>}
				<h2 className="landing-feature__title">{feature.title}</h2>
				<p className="landing-feature__lead">{feature.description}</p>
				{feature.bullets && feature.bullets.length > 0 && (
					<ul className="landing-feature__bullets">
						{feature.bullets.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				)}
			</div>
			<div className="landing-feature__visual">
				<LandingDeviceStage
					appSlug={app.slug}
					appName={app.appName}
					variant={feature.visual}
					featureIndex={featureIndex}
				/>
			</div>
		</section>
	)
}

/** Deep feature rows + device stages — no scroll reveals (Safari-friendly). */
export default function LandingFeaturesDeep({ app, features, photoMoments }: Props) {
	if (features.length === 0) return null

	return (
		<div className="landing__features landing__features--deep">
			{features.map((feature, index) => (
				<Fragment key={feature.title}>
					<FeatureSection app={app} feature={feature} featureIndex={index} />
					{photoMoments
						?.filter((moment) => moment.afterFeature === index)
						.map((moment) => (
							<LandingPhotoMoment key={moment.id} moment={moment} />
						))}
				</Fragment>
			))}
		</div>
	)
}
