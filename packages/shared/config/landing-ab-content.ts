export type LandingAbAntiCopy = {
	interruptTitle: string
	interruptLead: string
	paragraphs: string[]
	footnote: string
	ctaLabel: string
}

export const landingAbAntiCopyBySlug: Record<string, LandingAbAntiCopy> = {
	rawclinic: {
		interruptTitle: 'Okay, stop.',
		interruptLead: 'This isn’t going to be another boring “premium” landing page.',
		paragraphs: [
			'RAW Clinic develops Apple ProRAW on your iPhone and iPad — dial back the baked-in Deep Fusion look, work through a queue, export when you’re done.',
			'No cinematic scroll journey. No paragraph about “material honesty” or shadows on machined aluminum. No three-act story about why photography matters.',
			'It’s a photo app. It works on your device. It’s free. That’s the pitch.'
		],
		footnote: '(Yes, we already built the fancy version above. Industry rules.)',
		ctaLabel: 'Download — no manifesto required'
	},
	'aqi-sense': {
		interruptTitle: 'Alright, halt.',
		interruptLead: 'We’re not doing the whole “breathe easy with premium air quality” thing.',
		paragraphs: [
			'AQI Sense shows air quality near you from WAQI, Sensor.Community, and OpenSenseMap — feed, map, favorites, your preferred AQI scale.',
			'You will not get a hero quote about wellness, a parallax fog layer, or six cards explaining why clean air is a lifestyle.',
			'Check the number. Pin stations. Leave. Revolutionary.'
		],
		footnote: '(The polished version is still up there if you’re into that.)',
		ctaLabel: 'Get the app — skip the ceremony'
	}
}

export function getLandingAbAntiCopy(slug: string): LandingAbAntiCopy | null {
	return landingAbAntiCopyBySlug[slug] ?? null
}
