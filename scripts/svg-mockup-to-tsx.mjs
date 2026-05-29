/**
 * Converts Figma mockup SVGs into React frame components with a screen slot.
 * Replaces #FF0090 placeholder rects with foreignObject + {children}.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')

const TARGETS = [
	{
		input: 'components/mockups/iphone.svg',
		output: 'components/mockups/IPhoneMockupFrame.tsx',
		exportName: 'IPhoneMockupFrame',
		viewBox: { w: 769, h: 1603 },
		screen: { x: 33.2393, y: 36.7373, w: 703.271, h: 1529, rx: 99.7175 },
		screenPattern:
			/<g mask="url\(#mask0_4344_12124\)">\s*<rect x="33\.2393" y="36\.7373" width="703\.271" height="1529" fill="#FF0090"\/>\s*<\/g>/,
		screenSlot: ({ uid }) => `<mask id={\`\${${uid}}-screen-mask\`} style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="31" y="34" width="708" height="1534">
<rect x="33.2393" y="36.7373" width="703.271" height="1529" rx="99.7175" fill="white" stroke="white" strokeWidth="3.49886"/>
</mask>
<g mask={\`url(#\${${uid}}-screen-mask)\`}>
<foreignObject x="33.2393" y="36.7373" width="703.271" height="1529">
<div className="device-mockup-frame__screen">
{children}
</div>
</foreignObject>
</g>`
	},
	{
		input: 'components/mockups/ipad.svg',
		output: 'components/mockups/IPadMockupFrame.tsx',
		exportName: 'IPadMockupFrame',
		viewBox: { w: 1575, h: 2208 },
		screen: { x: 180.095, y: 148.281, w: 1210, h: 1842 },
		screenPattern:
			/<g clip-path="url\(#clip0_4344_12073\)">\s*<rect x="180\.095" y="148\.281" width="1210" height="1842" fill="#FF0090"\/>\s*<\/g>/,
		screenSlot: ({ uid }) => `<g clipPath={\`url(#\${${uid}}-clip0_4344_12073)\`}>
<foreignObject x="180.095" y="148.281" width="1210" height="1842">
<div className="device-mockup-frame__screen">
{children}
</div>
</foreignObject>
</g>`
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

/** CSS/SVG filter blend modes not valid on SVG `<feBlend mode>`. */
function fixUnsupportedBlendModes(s) {
	return s
		.replaceAll('mode="plus-lighter"', 'mode="lighten"')
		.replaceAll('mode="plus-darker"', 'mode="darken"')
		.replaceAll('mix-blend-mode:plus-lighter"', 'mix-blend-mode:lighten"')
		.replaceAll('mix-blend-mode:plus-darker"', 'mix-blend-mode:darken"')
}

function fixStyles(s) {
	return fixUnsupportedBlendModes(s)
		.replaceAll('style="mask-type:luminance"', 'style={{ maskType: "luminance" }}')
		.replaceAll('style="mask-type:alpha"', 'style={{ maskType: "alpha" }}')
		.replaceAll(/style="mix-blend-mode:([^"]+)"/g, (_, mode) => {
			const mapped =
				mode === 'plus-lighter' ? 'lighten' : mode === 'plus-darker' ? 'darken' : mode
			return `style={{ mixBlendMode: "${mapped}" }}`
		})
}

function prefixIds(svg, uidVar) {
	return svg
		.replace(/\bid="([^"]+)"/g, (_, id) => `id={\`\${${uidVar}}-${id}\`}`)
		.replace(
			/\b(filter|mask|clipPath|fill|stroke)="url\(#([^)]+)\)"/g,
			(_, attr, id) => `${attr}={\`url(#\${${uidVar}}-${id})\`}`
		)
}

function convertSvgToInner(svg, target) {
	let inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
	if (!target.screenPattern.test(inner)) {
		throw new Error(`Screen placeholder not found in ${target.input}`)
	}
	inner = inner.replace(target.screenPattern, '__SCREEN_SLOT__')
	inner = renameAttrs(inner)
	inner = fixUnsupportedBlendModes(inner)
	inner = fixStyles(inner)
	inner = prefixIds(inner, 'uid')
	inner = inner.replace('__SCREEN_SLOT__', target.screenSlot({ uid: 'uid' }))
	return inner
}

function convertDefs(defs) {
	let d = defs
	d = renameAttrs(d)
	d = fixUnsupportedBlendModes(d)
	d = fixStyles(d)
	d = prefixIds(d, 'uid')
	return d
}

for (const target of TARGETS) {
	const svgPath = path.join(ROOT, target.input)
	const svg = fs.readFileSync(svgPath, 'utf8')
	const defsMatch = svg.match(/<defs>[\s\S]*<\/defs>/)
	if (!defsMatch) throw new Error(`No defs in ${target.input}`)

	const body = convertSvgToInner(svg, target)
	const defs = convertDefs(defsMatch[0])

	const component = `'use client'

import { useId, type ReactNode, type SVGProps } from 'react'
import clsx from 'clsx'

export type ${target.exportName}Props = SVGProps<SVGSVGElement> & {
\tchildren?: ReactNode
}

/** Figma device frame — screen content goes in \`children\` (replaces #FF0090 slot). */
export function ${target.exportName}({ children, className, ...props }: ${target.exportName}Props) {
\tconst uid = useId().replace(/:/g, '')
\treturn (
\t\t<svg
\t\t\tviewBox="0 0 ${target.viewBox.w} ${target.viewBox.h}"
\t\t\tfill="none"
\t\t\txmlns="http://www.w3.org/2000/svg"
\t\t\tclassName={clsx('device-mockup-frame', className)}
\t\t\t{...props}
\t\t>
\t\t\t${body.trim()}
\t\t\t${defs.trim()}
\t\t</svg>
\t)
}
`

	fs.writeFileSync(path.join(ROOT, target.output), component)
	console.log('Wrote', target.output)
}
