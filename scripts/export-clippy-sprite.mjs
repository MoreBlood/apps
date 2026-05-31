/**
 * Export vertical frame strip → PNG sprite for CSS steps() animation.
 * Run after replacing clippy-clippit.gif (do NOT use chroma-key-clippy.mjs — it breaks GIF pages).
 */
import sharp from 'sharp'

const GIF = 'public/clippy-clippit.gif'
const OUT = 'public/clippy-clippit-sprite.png'
const PAGE_HEIGHT = 208

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

const meta = await sharp(GIF).metadata()
const frames = Math.round(meta.height / PAGE_HEIGHT)
console.log(`Sprite: ${meta.width}x${meta.height}, ${frames} frames`)

const { data } = await sharp(GIF).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const out = Buffer.from(data)
for (let i = 0; i < out.length; i += 4) {
	out[i + 3] = backdropAlpha(out[i], out[i + 1], out[i + 2], out[i + 3])
}

await sharp(out, {
	raw: { width: meta.width, height: meta.height, channels: 4 }
})
	.png({ compressionLevel: 9 })
	.toFile(OUT)

console.log(`Wrote ${OUT}`)
