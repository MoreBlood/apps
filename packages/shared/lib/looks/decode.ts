import { inflateRawSync, inflateSync } from 'node:zlib'
import { type SharedLookPayload, SharedLookPayloadSchema } from './schema'

/**
 * Декод самодостаточной «fat»-ссылки (payload зашит в токен) — для случая, когда кода
 * нет в БД (старая ссылка / опубликовано оффлайн). Формат как в iOS `SharedLookCodec`:
 * base64url( [1 байт-флаг] + тело ), флаг 1 = DEFLATE, 0 = сырой JSON.
 *
 * Apple `NSData.compressed(.zlib)` = RAW DEFLATE (RFC 1951) → `inflateRawSync`.
 * На всякий случай пробуем и zlib-обёрнутый вариант.
 */
export function decodeSelfContainedLook(token: string): SharedLookPayload | null {
	try {
		const b64 = token.replace(/-/g, '+').replace(/_/g, '/')
		const pad = b64.length % 4 ? '='.repeat(4 - (b64.length % 4)) : ''
		const buf = Buffer.from(b64 + pad, 'base64')
		if (buf.length < 2) return null

		const flag = buf[0]
		const body = buf.subarray(1)

		let jsonBuf: Buffer
		if (flag === 1) {
			try {
				jsonBuf = inflateRawSync(body)
			} catch {
				jsonBuf = inflateSync(body)
			}
		} else {
			jsonBuf = body
		}

		const obj = JSON.parse(jsonBuf.toString('utf8'))
		const parsed = SharedLookPayloadSchema.safeParse(obj)
		return parsed.success ? parsed.data : null
	} catch {
		return null
	}
}
