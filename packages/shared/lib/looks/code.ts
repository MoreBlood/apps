/** URL-safe алфавит без визуально похожих символов (0/O, 1/l/I). */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'

/** Короткий код для ссылки `/l/<code>`. 7 симв. ≈ 55^7 ≈ 1.5e12 вариантов. */
export function generateLookCode(length = 7): string {
	const bytes = crypto.getRandomValues(new Uint8Array(length))
	let out = ''
	for (let i = 0; i < length; i++) {
		out += ALPHABET[bytes[i] % ALPHABET.length]
	}
	return out
}
