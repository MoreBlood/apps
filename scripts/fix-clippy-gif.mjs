/**
 * Repair clippy GIF when frames were merged into one vertical strip (pages: 1).
 * Also keys out teal + black backdrop.
 */
import sharp from 'sharp'

const PATH = 'public/clippy-clippit.gif'
const PAGE_HEIGHT = 208
const WIDTH = 220

const TEAL = { r: 58, g: 144, b: 166 }
const TEAL_HARD = 28
const TEAL_SOFT = 85

function backdropAlpha(r, g, b, a) {
	if (r + g + b < 36) return 0
	const d = Math.abs(r - TEAL.r) + Math.abs(g - TEAL.g) + Math.abs(b - TEAL.b)
	if (d <= TEAL_HARD) return 0
	if (d >= TEAL_SOFT) return a
	return Math.min(a, Math.round(((d - TEAL_HARD) / (TEAL_SOFT - TEAL_HARD)) * 255))
}

const meta = await sharp(PATH).metadata()
const pages = Math.round(meta.height / PAGE_HEIGHT)
if (pages < 2) {
	console.error(`Unexpected layout: height=${meta.height}, expected stacked frames`)
	process.exit(1)
}

console.log(`Rebuilding ${pages} frames @ ${WIDTH}x${PAGE_HEIGHT}`)

const { data, info } = await sharp(PATH).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const out = Buffer.from(data)
for (let i = 0; i < out.length; i += 4) {
	out[i + 3] = backdropAlpha(out[i], out[i + 1], out[i + 2], out[i + 3])
}

const delay = Array.from({ length: pages }, () => 100)
// Match original pacing (optional highlights)
if (pages >= 28) delay[27] = 300
if (pages >= 34) delay[33] = 200
if (pages >= 35) delay[34] = 300

await sharp(out, {
	raw: { width: info.width, height: info.height, channels: 4 },
	animated: true,
	pageHeight: PAGE_HEIGHT,
	loop: 0,
	delay
})
	.gif({ effort: 8, colours: 128, dither: 0.5 })
	.toFile(PATH)

const fixed = await sharp(PATH, { animated: true, pages: -1 }).metadata()
console.log(`Done: pages=${fixed.pages}, pageHeight=${fixed.pageHeight}, loop=${fixed.loop}`)
