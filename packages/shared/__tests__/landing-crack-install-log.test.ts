import { describe, expect, it } from 'vitest'
import { getLandingCrackScene } from '@/config/landing-crack-content'
import { buildInstallInitLines, buildInstallLogLines, buildInstallRunLines } from '@/lib/landing-crack-install-log'

describe('landing-crack-install-log', () => {
	it('splits init wizard lines from install run lines', () => {
		const scene = getLandingCrackScene('rawclinic')
		if (!scene) throw new Error('fixture missing')

		const init = buildInstallInitLines(scene)
		const run = buildInstallRunLines(scene)
		const all = buildInstallLogLines(scene)
		const asciiRows = scene.ascii.split('\n').length

		expect(init).toHaveLength(asciiRows + 1 + 2)
		expect(run).toHaveLength(scene.logLines.length)
		expect(all).toHaveLength(init.length + run.length)
		expect(all[asciiRows + 3]?.text).toBe(scene.logLines[0])
	})
})
