'use client'

import { Fragment } from 'react'
import type { LandingAppInfo } from '@/config'
import type { AppLandingConfig } from '@/types/landing'
import LandingDeviceStage from './LandingDeviceStage'
import LandingPhotoMoment from './LandingPhotoMoment'
import { LandingReveal } from './LandingReveal'

type Props = {
	app: LandingAppInfo
	features: AppLandingConfig['features']
	photoMoments?: AppLandingConfig['photoMoments']
	verticalReveal: boolean
}

function FeatureSection({
	app,
	feature,
	featureIndex,
	verticalReveal
}: {
	app: LandingAppInfo
	feature: AppLandingConfig['features'][number]
	featureIndex: number
	verticalReveal: boolean
}) {
	const reverse = feature.visualOnLeft === true
	const contentDirection = verticalReveal ? 'up' : reverse ? 'right' : 'left'
	const visualDirection = verticalReveal ? 'up' : reverse ? 'left' : 'right'

	return (
		<section className={`landing-feature${reverse ? ' landing-feature--reverse' : ''}`}>
			<LandingReveal className="landing-feature__content" direction={contentDirection} duration={0.7}>
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
			</LandingReveal>
			<LandingReveal className="landing-feature__visual" direction={visualDirection} delay={0.08} duration={0.75}>
				<LandingDeviceStage
					appSlug={app.slug}
					appName={app.appName}
					variant={feature.visual}
					featureIndex={featureIndex}
				/>
			</LandingReveal>
		</section>
	)
}

/** Deep feature rows + device stages — viewport-tier chunk. */
export default function LandingFeaturesDeep({ app, features, photoMoments, verticalReveal }: Props) {
	if (features.length === 0) return null

	return (
		<div className="landing__features landing__features--deep">
			{features.map((feature, index) => (
				<Fragment key={feature.title}>
					<FeatureSection app={app} feature={feature} featureIndex={index} verticalReveal={verticalReveal} />
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
