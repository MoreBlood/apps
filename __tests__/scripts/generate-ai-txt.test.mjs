import { describe, it, expect } from 'vitest'
import { buildCanonicalBase, buildContent } from '../../scripts/generate-ai-txt.mjs'

describe('buildCanonicalBase', () => {
	it('returns siteUrl as-is when no basePath', () => {
		expect(buildCanonicalBase('https://mysite.com', '')).toBe('https://mysite.com')
	})

	it('strips trailing slash from siteUrl', () => {
		expect(buildCanonicalBase('https://mysite.com/', '')).toBe('https://mysite.com')
	})

	it('appends clean basePath', () => {
		expect(buildCanonicalBase('https://mysite.com', 'rawclinic-web')).toBe(
			'https://mysite.com/rawclinic-web'
		)
	})

	it('strips leading and trailing slashes from basePath', () => {
		expect(buildCanonicalBase('https://mysite.com/', '/rawclinic-web/')).toBe(
			'https://mysite.com/rawclinic-web'
		)
	})

	it('falls back to https://example.com when siteUrl is undefined', () => {
		expect(buildCanonicalBase(undefined, '')).toBe('https://example.com')
	})

	it('falls back to https://example.com and appends basePath', () => {
		expect(buildCanonicalBase(undefined, 'sub')).toBe('https://example.com/sub')
	})
})

describe('buildContent', () => {
	const siteName = 'Test Apps'
	const base = 'https://mysite.com'

	it('contains identity section with correct name and url', () => {
		const content = buildContent(siteName, base)
		expect(content).toContain(`name: ${siteName}`)
		expect(content).toContain(`url: ${base}`)
	})

	it('includes [permissions], [restrictions] and [attribution] sections', () => {
		const content = buildContent(siteName, base)
		expect(content).toContain('[permissions]')
		expect(content).toContain('[restrictions]')
		expect(content).toContain('[attribution]')
	})

	it('sets preferred_citation with site name and url', () => {
		const content = buildContent(siteName, base)
		expect(content).toContain(`preferred_citation: ${siteName} (${base})`)
	})

	it('uses canonical base in file header comment', () => {
		const content = buildContent(siteName, base)
		expect(content).toContain(`# ai.txt for ${siteName}`)
		expect(content).toContain(`# ${base}/ai.txt`)
	})
})
