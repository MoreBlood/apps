/**
 * Converts Figma mockup SVGs into React frame components (bezel only).
 * Removes screen placeholder rects (#000000 / legacy #FF0090); screen content is HTML under the SVG.
 * Strips filters, blend modes, and linear gradients (replaced with solid fills).
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')

/** Figma screen-slot marker — black so it never flashes during CSS transforms. */
const SCREEN_PLACEHOLDER = '#000000'

const TARGETS = [
	{
		input: 'components/mockups/iphone.svg',
		output: 'components/mockups/IPhoneMockupFrame.tsx',
		exportName: 'IPhoneMockupFrame',
		uidKey: 'iphone-frame',
		viewBox: { w: 769, h: 1603 },
		screenPattern:
			/<g>\s*<mask id="mask0_4344_12124"[\s\S]*?<\/mask>\s*<g mask="url\(#mask0_4344_12124\)">\s*<rect x="33\.2393" y="36\.7373" width="703\.271" height="1529" fill="(?:#000000|#FF0090)"\/>\s*<\/g>\s*<\/g>/,
		screenSlot: () => ''
	},
	{
		input: 'components/mockups/ipad.svg',
		output: 'components/mockups/IPadMockupFrame.tsx',
		exportName: 'IPadMockupFrame',
		uidKey: 'ipad-frame',
		viewBox: { w: 1415, h: 2048 },
		screenPattern:
			/<g clip-path="url\(#clip0_[^"]+\)">\s*<rect x="100\.389" y="100" width="1210" height="1842" fill="(?:#000000|#FF0090)"\s*\/?>\s*<\/g>/,
		screenSlot: () => ''
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

function chassisCutoutMaskMarkup(screen, viewBox) {
	return `<mask id={\`\${uid}-chassis-cutout\`} style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="${viewBox.w}" height="${viewBox.h}">
<rect width="${viewBox.w}" height="${viewBox.h}" fill="white"/>
<rect x="${screen.x}" y="${screen.y}" width="${screen.w}" height="${screen.h}" rx="${screen.rx}" fill="black"/>
</mask>
<g mask={\`url(#\${uid}-chassis-cutout)\`}>`
}

function wrapChassisWithScreenCutout(inner, target) {
	const { chassisCutout, chassisFillsPattern, viewBox } = target
	if (!chassisCutout || !chassisFillsPattern) return inner
	const open = chassisCutoutMaskMarkup(chassisCutout, viewBox)
	const next = inner.replace(chassisFillsPattern, `${open}$&</g>`)
	if (next === inner) {
		throw new Error(`Chassis fills not found for screen cutout in ${target.input}`)
	}
	return next
}

function convertSvgToInner(svg, target) {
	let inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
	inner = inner.replace(/<defs>[\s\S]*<\/defs>/, '')
	if (!target.screenPattern.test(inner)) {
		throw new Error(`Screen placeholder not found in ${target.input}`)
	}
	inner = inner.replace(target.screenPattern, target.screenSlot())
	inner = wrapChassisWithScreenCutout(inner, target)
	inner = renameAttrs(inner)
	inner = fixStyles(inner)
	return prefixIds(inner, 'uid')
}

function convertDefs(defs) {
	let d = prepareSvgMarkup(defs)
	// Screen slot is HTML — drop Figma clip0 placeholder defs.
	d = d.replace(/<clipPath id="clip0_[^"]+">[\s\S]*?<\/clipPath>\s*/gi, '')
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
import type { SVGProps } from 'react'
import { stableDomId } from '@/lib/stable-dom-id'

export type ${target.exportName}Props = SVGProps<SVGSVGElement> & {
\tinstanceId: string
}

/** Figma device bezel (SVG only). Screen content sits in \`.device-mockup__screen\` under this layer. */
export function ${target.exportName}({ className, instanceId, ...props }: ${target.exportName}Props) {
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
