import { describe, expect, it } from 'vitest'
import { listFinderPath } from '@/config/landing-crack-finder'

describe('landing-crack-finder', () => {
	it('lists photo roll folders for rawclinic', () => {
		const root = listFinderPath('/', 'rawclinic')
		expect(root.some((i) => i.kind === 'folder' && i.name === 'Documents')).toBe(true)
		expect(root.some((i) => i.kind === 'folder' && i.name === 'Before_After')).toBe(true)

		const docs = listFinderPath('/Documents', 'rawclinic')
		expect(docs.some((i) => i.kind === 'text' && i.name === 'README_HONEST.txt')).toBe(true)

		const roll = listFinderPath('/Before_After', 'rawclinic')
		expect(roll.filter((i) => i.kind === 'folder').map((i) => i.name)).toEqual(
			expect.arrayContaining(['cat', 'dom', 'koleso'])
		)

		const scene = listFinderPath('/Before_After/cat', 'rawclinic')
		expect(scene.filter((i) => i.kind === 'image')).toHaveLength(2)
		const before = scene.find((i) => i.kind === 'image' && i.variant === 'before')
		expect(before?.kind === 'image' && before.pairId).toBe('cat')
	})
})
