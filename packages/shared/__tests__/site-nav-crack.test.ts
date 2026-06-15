import { describe, expect, it } from 'vitest'
import { getApps } from '@/config'
import { getCrackNavMenuGroups, getSiteNavItems } from '@/lib/site-nav'

function itemLabels(entries: { type: string; label?: string; items?: { label: string }[] }[]) {
	return entries.map((e) => {
		if (e.type === 'sub') return `Help[${e.items?.map((i) => i.label).join(',')}]`
		if (e.type === 'separator') return '---'
		return e.label
	})
}

describe('getCrackNavMenuGroups', () => {
	it('mirrors pill nav and mobile apps list for app routes', () => {
		const items = getSiteNavItems('rawclinic')
		const groups = getCrackNavMenuGroups(items, getApps(), {
			appMenuLabel: 'RAW Clinic',
			appsSectionTitle: 'Our apps'
		})

		expect(groups.map((g) => g.label)).toEqual(['Site', 'RAW Clinic', 'Our apps'])
		expect(itemLabels(groups[0]?.entries ?? [])).toEqual(['Home', 'Blog'])
		expect(itemLabels(groups[1]?.entries ?? [])).toEqual([
			'Overview',
			'Roadmap',
			'---',
			'Help[FAQ,Privacy,Terms,Feedback]'
		])
		expect(groups[2]?.entries.filter((e) => e.type === 'item').map((e) => (e.type === 'item' ? e.href : ''))).toEqual([
			'/rawclinic',
			'/aqi-sense'
		])
	})

	it('omits app group on hub-only routes', () => {
		const items = getSiteNavItems(null)
		const groups = getCrackNavMenuGroups(items, getApps(), {
			appMenuLabel: 'App',
			appsSectionTitle: 'Our apps'
		})

		expect(groups.map((g) => g.label)).toEqual(['Site', 'Our apps'])
	})

	it('omits Our apps group on single-app sites', () => {
		const prev = process.env.NEXT_PUBLIC_SITE_MODE
		process.env.NEXT_PUBLIC_SITE_MODE = 'single-app'

		try {
			const items = getSiteNavItems('rawclinic')
			const groups = getCrackNavMenuGroups(items, getApps(), {
				appMenuLabel: 'RAW Clinic',
				appsSectionTitle: 'Our apps'
			})

			expect(groups.map((g) => g.label)).toEqual(['Site', 'RAW Clinic'])
			expect(itemLabels(groups[0]?.entries ?? [])).toEqual(['Home', 'Blog'])
		} finally {
			if (prev === undefined) delete process.env.NEXT_PUBLIC_SITE_MODE
			else process.env.NEXT_PUBLIC_SITE_MODE = prev
		}
	})
})
