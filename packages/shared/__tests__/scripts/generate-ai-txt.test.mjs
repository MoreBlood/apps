import { describe, expect, it } from 'vitest'
import {
	buildCanonicalBase,
	buildContent,
	inferAppDefaults,
	parseEnvFile,
	resolveAiTxtEnv
} from '../../scripts/generate-ai-txt.mjs'

describe('buildCanonicalBase', () => {
	it('returns siteUrl as-is when no basePath', () => {
		expect(buildCanonicalBase('https://mysite.com', '')).toBe('https://mysite.com')
	})

	it('strips trailing slash from siteUrl', () => {
		expect(buildCanonicalBase('https://mysite.com/', '')).toBe('https://mysite.com')
	})

	it('appends clean basePath', () => {
		expect(buildCanonicalBase('https://mysite.com', 'rawclinic-web')).toBe('https://mysite.com/rawclinic-web')
	})

	it('strips leading and trailing slashes from basePath', () => {
		expect(buildCanonicalBase('https://mysite.com/', '/rawclinic-web/')).toBe('https://mysite.com/rawclinic-web')
	})

	it('falls back to https://example.com in production without env', () => {
		const prev = process.env.NODE_ENV
		const prevGh = process.env.GITHUB_REPOSITORY
		process.env.NODE_ENV = 'production'
		delete process.env.GITHUB_REPOSITORY
		expect(buildCanonicalBase(undefined, '')).toBe('https://example.com')
		process.env.NODE_ENV = prev
		process.env.GITHUB_REPOSITORY = prevGh
	})

	it('derives origin from GITHUB_REPOSITORY when siteUrl is undefined', () => {
		const prevGh = process.env.GITHUB_REPOSITORY
		process.env.GITHUB_REPOSITORY = 'moreblood/apps'
		expect(buildCanonicalBase(undefined, 'apps')).toBe('https://moreblood.github.io/apps')
		process.env.GITHUB_REPOSITORY = prevGh
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

describe('parseEnvFile', () => {
	it('parses KEY=value lines and skips comments', () => {
		expect(
			parseEnvFile(`
# comment
SITE_NAME=RAW Clinic
NEXT_PUBLIC_SITE_URL="https://rawclinic.click"
`)
		).toEqual({
			SITE_NAME: 'RAW Clinic',
			NEXT_PUBLIC_SITE_URL: 'https://rawclinic.click'
		})
	})
})

describe('inferAppDefaults', () => {
	it('returns rawclinic defaults', () => {
		expect(inferAppDefaults('/repo/apps/rawclinic')).toMatchObject({
			SITE_NAME: 'RAW Clinic',
			NEXT_PUBLIC_SITE_URL: 'https://www.rawclinic.click'
		})
	})

	it('returns hub defaults with base path', () => {
		expect(inferAppDefaults('/repo/apps/hub')).toMatchObject({
			SITE_NAME: 'AK Apps',
			NEXT_PUBLIC_BASE_PATH: '/apps'
		})
	})
})

describe('resolveAiTxtEnv', () => {
	it('prefers process env over app defaults', () => {
		expect(
			resolveAiTxtEnv('/repo/apps/rawclinic', {
				SITE_NAME: 'Override',
				NEXT_PUBLIC_SITE_URL: 'https://example.com'
			})
		).toEqual({
			siteName: 'Override',
			siteUrl: 'https://example.com',
			basePath: undefined
		})
	})

	it('falls back to BASE_PATH when NEXT_PUBLIC_BASE_PATH is unset', () => {
		expect(
			resolveAiTxtEnv('/repo/apps/hub', {
				BASE_PATH: '/apps'
			})
		).toMatchObject({
			basePath: '/apps'
		})
	})
})
