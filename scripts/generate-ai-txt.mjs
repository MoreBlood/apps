import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export function buildCanonicalBase(siteUrl, basePath) {
	const cleanBase = (siteUrl ?? 'https://example.com').replace(/\/$/, '')
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

// Entry point — only runs when executed directly, not when imported
if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const __dirname = dirname(fileURLToPath(import.meta.url))
	const root = join(__dirname, '..')

	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
	const basePath = process.env.NEXT_PUBLIC_BASE_PATH
	const siteName = process.env.SITE_NAME ?? 'Artihovich Apps'
	const canonicalBase = buildCanonicalBase(siteUrl, basePath)
	const content = buildContent(siteName, canonicalBase)

	writeFileSync(join(root, 'public', 'ai.txt'), content, 'utf8')
	console.log('Generated public/ai.txt')
}
