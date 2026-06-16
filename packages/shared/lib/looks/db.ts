import { neon } from '@neondatabase/serverless'
import type { SharedLookPayload } from './schema'

/** Подключение к Vercel Postgres (Neon). Создаём лениво — env читается на запросе, не на билде. */
function getSql() {
	const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
	if (!url) {
		throw new Error('Looks DB not configured (DATABASE_URL / POSTGRES_URL missing).')
	}
	return neon(url)
}

/** Вставляет лук под уникальным коротким кодом (с ретраями на коллизию). Возвращает код. */
export async function createSharedLook(
	payload: SharedLookPayload,
	title: string,
	schemaVersion: number,
	genCode: () => string
): Promise<string> {
	const sql = getSql()
	const json = JSON.stringify(payload)
	for (let attempt = 0; attempt < 5; attempt++) {
		const code = genCode()
		const rows = (await sql`
			insert into shared_looks (code, payload, title, schema_version)
			values (${code}, ${json}::jsonb, ${title}, ${schemaVersion})
			on conflict (code) do nothing
			returning code`) as { code: string }[]
		if (rows.length > 0) return rows[0].code
	}
	throw new Error('Failed to allocate a unique code.')
}

/** Достаёт payload по коду (или null). */
export async function getSharedLook(code: string): Promise<{ payload: SharedLookPayload } | null> {
	const sql = getSql()
	const rows = (await sql`
		select payload from shared_looks where code = ${code} limit 1`) as { payload: SharedLookPayload }[]
	return rows[0] ? { payload: rows[0].payload } : null
}
