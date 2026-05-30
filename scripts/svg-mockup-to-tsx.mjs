/**
 * Converts Figma mockup SVGs into React frame components with a screen slot.
 * Replaces screen placeholder rects (#000000 / legacy #FF0090) with foreignObject + {children}.
 * Strips filters, blend modes, and linear gradients (replaced with solid fills).
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')

/** Figma screen-slot marker — black so it never flashes during CSS transforms. */
const SCREEN_PLACEHOLDER = '#000000'

/** Extra px on screen slot — hides subpixel gaps under the bezel during transforms. */
const SCREEN_BLEED = 3

function screenSlotMarkup({ uid, x, y, w, h, rx }) {
	const bx = x - SCREEN_BLEED
	const by = y - SCREEN_BLEED
	const bw = w + SCREEN_BLEED * 2
	const bh = h + SCREEN_BLEED * 2
	return `<clipPath id={\`\${${uid}}-screen-clip\`}>
<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${rx}" />
</clipPath>
<g clipPath={\`url(#\${${uid}}-screen-clip)\`}>
<foreignObject x="${bx}" y="${by}" width="${bw}" height="${bh}">
<div className="device-mockup-frame__screen">
{children}
</div>
</foreignObject>
</g>`
}

const TARGETS = [
	{
		input: 'components/mockups/iphone.svg',
		output: 'components/mockups/IPhoneMockupFrame.tsx',
		exportName: 'IPhoneMockupFrame',
		uidKey: 'iphone-frame',
		viewBox: { w: 769, h: 1603 },
		screenPattern:
			/<g>\s*<mask id="mask0_4344_12124"[\s\S]*?<\/mask>\s*<g mask="url\(#mask0_4344_12124\)">\s*<rect x="33\.2393" y="36\.7373" width="703\.271" height="1529" fill="(?:#000000|#FF0090)"\/>\s*<\/g>\s*<\/g>/,
		screenSlot: ({ uid }) => screenSlotMarkup({ uid, x: 33.2393, y: 36.7373, w: 703.271, h: 1529, rx: 99.7175 })
	},
	{
		input: 'components/mockups/ipad.svg',
		output: 'components/mockups/IPadMockupFrame.tsx',
		exportName: 'IPadMockupFrame',
		uidKey: 'ipad-frame',
		viewBox: { w: 1575, h: 2208 },
		screenPattern:
			/<g clip-path="url\(#clip0_4344_12073\)">\s*<rect x="180\.095" y="148\.281" width="1210" height="1842" fill="(?:#000000|#FF0090)"\/>\s*<\/g>/,
		screenSlot: ({ uid }) => screenSlotMarkup({ uid, x: 180.095, y: 148.281, w: 1210, h: 1842, rx: 35.6418 })
	}
]

const ATTR_RENAMES = [
	['color-interpolation-filters', 'colorInterpolationFilters'],
	['fill-opacity', 'fillOpacity'],
	['flood-opacity', 'floodOpacity'],
	['stop-color', 'stopColor'],
	['stop-opacity', 'stopOpacity'],
	['stroke-width', 'strokeWidth'],
	['shape-rendering', 'shapeRendering'],
	['clip-path', 'clipPath'],
	['clip-rule', 'clipRule'],
	['fill-rule', 'fillRule']
]

function renameAttrs(s) {
	let out = s
	for (const [from, to] of ATTR_RENAMES) {
		out = out.replaceAll(`${from}=`, `${to}=`)
	}
	return out
}

/** Drop Figma filter stacks — decorative and costly in Safari. */
function stripSvgFilters(s) {
	return s
		.replace(/<filter\b[^>]*>[\s\S]*?<\/filter>/gi, '')
		.replace(/<g\s+filter="url\([^"]+\)"\s*>/gi, '<g>')
		.replace(/\sfilter="url\(#([^)]+)\)"/gi, '')
}

function stripBlendStyles(s) {
	return s.replace(/\sstyle="mix-blend-mode:[^"]*"/gi, '')
}

function parseStopAttrs(attrs) {
	const color = attrs.match(/\bstop-color="([^"]+)"/)?.[1]
	const opacityRaw = attrs.match(/\bstop-opacity="([^"]+)"/)?.[1]
	const opacity = opacityRaw == null ? 1 : Number.parseFloat(opacityRaw)
	let offset = 0
	const offsetMatch = attrs.match(/\boffset="([^"]+)"/)
	if (offsetMatch) {
		const raw = offsetMatch[1]
		offset = raw.endsWith('%') ? Number.parseFloat(raw) / 100 : Number.parseFloat(raw)
	}
	return color && opacity > 0.12 ? { offset, color } : null
}

/** Pick a mid-tone stop — matches Figma button/camera gradients (~0.49). */
function solidFromGradient(gradientXml) {
	const stops = []
	for (const match of gradientXml.matchAll(/<stop\s+([^>]*)\/?>/gi)) {
		const stop = parseStopAttrs(match[1])
		if (stop) stops.push(stop)
	}
	if (!stops.length) return '#3D3F4D'
	stops.sort((a, b) => a.offset - b.offset)
	const mid = stops.find((s) => s.offset >= 0.4 && s.offset <= 0.6)
	if (mid) return mid.color
	return stops[Math.floor(stops.length / 2)].color
}

/** Replace gradient paints with solids and remove gradient definitions. */
function stripGradients(s) {
	const colors = new Map()
	const gradRe = /<(linearGradient|radialGradient)\s+id="([^"]+)"[^>]*>[\s\S]*?<\/\1>/gi

	const withoutDefs = s.replace(gradRe, (block, _type, id) => {
		colors.set(id, solidFromGradient(block))
		return ''
	})

	let out = withoutDefs
	for (const [id, color] of colors) {
		const esc = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
		out = out.replace(new RegExp(`url\\(#${esc}\\)`, 'g'), color)
	}
	return out
}

function fixStyles(s) {
	return stripBlendStyles(s)
		.replaceAll('style="mask-type:luminance"', 'style={{ maskType: "luminance" }}')
		.replaceAll('style="mask-type:alpha"', 'style={{ maskType: "alpha" }}')
}

function prefixIds(svg, uidVar) {
	return svg
		.replace(/\bid="([^"]+)"/g, (_, id) => `id={\`\${${uidVar}}-${id}\`}`)
		.replace(
			/\b(filter|mask|clipPath|fill|stroke)="url\(#([^)]+)\)"/g,
			(_, attr, id) => `${attr}={\`url(#\${${uidVar}}-${id})\`}`
		)
}

function normalizeScreenPlaceholder(svg) {
	return svg.replaceAll('fill="#FF0090"', `fill="${SCREEN_PLACEHOLDER}"`)
}

function prepareSvgMarkup(svg) {
	return normalizeScreenPlaceholder(stripGradients(stripBlendStyles(stripSvgFilters(svg))))
}

function convertSvgToInner(svg, target) {
	let inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
	inner = inner.replace(/<defs>[\s\S]*<\/defs>/, '')
	if (!target.screenPattern.test(inner)) {
		throw new Error(`Screen placeholder not found in ${target.input}`)
	}
	inner = inner.replace(target.screenPattern, '__SCREEN_SLOT__')
	inner = renameAttrs(inner)
	inner = fixStyles(inner)
	inner = prefixIds(inner, 'uid')
	inner = inner.replace('__SCREEN_SLOT__', target.screenSlot({ uid: 'uid' }))
	return inner
}

function convertDefs(defs) {
	let d = prepareSvgMarkup(defs)
	// Screen uses inline `screen-clip` — drop legacy Figma clip0 placeholder path.
	d = d.replace(/<clipPath id="clip0_4344_12073">[\s\S]*?<\/clipPath>\s*/i, '')
	d = renameAttrs(d)
	d = fixStyles(d)
	d = prefixIds(d, 'uid')
	if (!/<(clipPath|mask)\b/i.test(d)) {
		return ''
	}
	return d
		.replace(/<defs>\s*<\/defs>/, '')
		.replace(/^<defs>/, '')
		.replace(/<\/defs>\s*$/, '')
}

for (const target of TARGETS) {
	const svgPath = path.join(ROOT, target.input)
	const rawSvg = fs.readFileSync(svgPath, 'utf8')
	const svg = prepareSvgMarkup(rawSvg)
	fs.writeFileSync(svgPath, svg)

	const defsMatch = svg.match(/<defs>[\s\S]*<\/defs>/)
	if (!defsMatch) throw new Error(`No defs in ${target.input}`)

	const body = convertSvgToInner(svg, target)
	const defsInner = convertDefs(defsMatch[0])
	const defsBlock = defsInner.trim() ? `\n\t\t\t<defs>\n\t\t\t\t${defsInner.trim()}\n\t\t\t</defs>` : ''

	const component = `'use client'

import clsx from 'clsx'
import type { ReactNode, SVGProps } from 'react'
import { stableDomId } from '@/lib/stable-dom-id'

export type ${target.exportName}Props = SVGProps<SVGSVGElement> & {
\tchildren?: ReactNode
\tinstanceId: string
}

/** Figma device frame — screen content in \`children\` (replaces screen slot). Gradients/filters stripped at build. */
export function ${target.exportName}({ children, className, instanceId, ...props }: ${target.exportName}Props) {
\tconst uid = stableDomId(instanceId, '${target.uidKey}')
\treturn (
\t\t<svg
\t\t\tviewBox="0 0 ${target.viewBox.w} ${target.viewBox.h}"
\t\t\tfill="none"
\t\t\txmlns="http://www.w3.org/2000/svg"
\t\t\tpreserveAspectRatio="xMidYMid meet"
\t\t\tclassName={clsx('device-mockup-frame', className)}
\t\t\trole="presentation"
\t\t\t{...props}
\t\t>
\t\t\t${body.trim()}${defsBlock}
\t\t</svg>
\t)
}
`

	fs.writeFileSync(path.join(ROOT, target.output), component)
	console.log('Wrote', target.output)
}

const generatedPaths = TARGETS.map((t) => path.join(ROOT, t.output))
const formatResult = spawnSync('npx', ['@biomejs/biome', 'check', '--write', ...generatedPaths], {
	cwd: ROOT,
	stdio: 'inherit'
})
if (formatResult.status !== 0) {
	process.exit(formatResult.status ?? 1)
}
