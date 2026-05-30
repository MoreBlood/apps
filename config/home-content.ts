export const homeContent = {
	heroEyebrow: 'AK Apps',
	heroTitle: 'Native iOS apps, built with care.',
	heroLead: 'Focused utilities for iPhone and iPad.',
	appsTitle: 'Our apps',
	closingQuote:
		'We believe software should be native, quiet, and honest — about what it does, what it costs in attention, and what it does with your data. Each app starts from one idea worth keeping on your Home Screen.',
	closingAttribution: 'The idea behind AK Apps'
} as const

export type HomeAppCardData = {
	slug: string
	appName: string
	tagline: string
	excerpt: string
	eyebrow: string
	accentColor: string
	storeLink?: string
}
