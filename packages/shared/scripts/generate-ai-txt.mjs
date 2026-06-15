import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export function resolveSiteOrigin(siteUrl) {
	if (siteUrl?.trim()) {
		return siteUrl.trim().replace(/\/$/, '')
	}
	const gh = process.env.GITHUB_REPOSITORY
	if (gh) {
		const [owner, repo] = gh.split('/')
		if (repo.endsWith('.github.io')) {
			return `https://${repo}`
		}
		return `https://${owner}.github.io`
	}
	if (process.env.NODE_ENV !== 'production') {
		return 'http://localhost:3000'
	}
	return 'https://example.com'
}

export function buildCanonicalBase(siteUrl, basePath) {
	const cleanBase = resolveSiteOrigin(siteUrl)
	const cleanPath = (basePath ?? '').replace(/^\/|\/$/g, '')
	return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase
}

export function buildContent(siteName, canonicalBase) {
	return `# ai.txt for ${siteName}
# ${canonicalBase}/ai.txt

[identity]
name: ${siteName}
url: ${canonicalBase}

[permissions]
- Summarise publicly available content from this website
- Quote app descriptions and pages with attribution
- Answer factual questions about our apps and services
- Include our site in relevant search results and recommendations

[restrictions]
- Do not generate quotes attributed to us or our team without a verifiable source
- Do not imply we endorse specific products or services
- Do not reproduce full legal or policy text; summarise and link instead
- Do not present app capabilities or features that are not stated on the site

[attribution]
preferred_citation: ${siteName} (${canonicalBase})
when_quoting: Include page or app name and link to source
link_policy: Prefer linking to the original page when possible
`
}

export function parseEnvFile(content) {
	const env = {}
	for (const line of content.split('\n')) {
		const trimmed = line.trim()
		if (!trimmed || trimmed.startsWith('#')) continue
		const eq = trimmed.indexOf('=')
		if (eq === -1) continue
		const key = trimmed.slice(0, eq).trim()
		let value = trimmed.slice(eq + 1).trim()
		if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
			value = value.slice(1, -1)
		}
		env[key] = value
	}
	return env
}

/** Per-app defaults when .env is missing (hub vs rawclinic). */
export function inferAppDefaults(cwd) {
	const name = basename(cwd)
	if (name === 'rawclinic') {
		return {
			SITE_NAME: 'RAW Clinic',
			NEXT_PUBLIC_SITE_URL: 'https://www.rawclinic.click'
		}
	}
	if (name === 'hub') {
		return {
			SITE_NAME: 'AK Apps',
			NEXT_PUBLIC_SITE_URL: 'https://moreblood.github.io',
			NEXT_PUBLIC_BASE_PATH: '/apps'
		}
	}
	return {}
}

export function loadAppEnv(cwd) {
	const loaded = { ...inferAppDefaults(cwd) }
	for (const file of ['.env.local', '.env']) {
		const path = join(cwd, file)
		if (!existsSync(path)) continue
		Object.assign(loaded, parseEnvFile(readFileSync(path, 'utf8')))
	}
	return loaded
}

export function resolveAiTxtEnv(cwd, processEnv = process.env) {
	const appEnv = loadAppEnv(cwd)
	return {
		siteUrl: processEnv.NEXT_PUBLIC_SITE_URL ?? appEnv.NEXT_PUBLIC_SITE_URL,
		basePath:
			processEnv.NEXT_PUBLIC_BASE_PATH ?? processEnv.BASE_PATH ?? appEnv.NEXT_PUBLIC_BASE_PATH ?? appEnv.BASE_PATH,
		siteName: processEnv.SITE_NAME ?? appEnv.SITE_NAME ?? 'AK Apps'
	}
}

// Entry point — run from apps/hub or apps/rawclinic so cwd picks up the right env.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const __dirname = dirname(fileURLToPath(import.meta.url))
	const sharedRoot = join(__dirname, '..')
	const outPath = join(sharedRoot, 'public', 'ai.txt')
	const { siteUrl, basePath, siteName } = resolveAiTxtEnv(process.cwd())
	const content = buildContent(siteName, buildCanonicalBase(siteUrl, basePath))

	const prev = existsSync(outPath) ? readFileSync(outPath, 'utf8') : null
	if (prev !== content) {
		writeFileSync(outPath, content, 'utf8')
		console.log(`Generated ${outPath} (${siteName})`)
	} else {
		console.log(`ai.txt up to date (${siteName})`)
	}
}
