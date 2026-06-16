import { NextResponse } from 'next/server'
import { generateLookCode } from '@/lib/looks/code'
import { createSharedLook } from '@/lib/looks/db'
import { PublishRequestSchema } from '@/lib/looks/schema'

export const dynamic = 'force-dynamic'

const MAX_PAYLOAD_BYTES = 24 * 1024
const SITE = 'https://rawclinic.click'

/** POST /api/looks — публикует лук, возвращает короткий код и ссылку. */
export async function POST(request: Request) {
	let body: unknown
	try {
		body = await request.json()
	} catch {
		return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
	}

	const parsed = PublishRequestSchema.safeParse(body)
	if (!parsed.success) {
		return NextResponse.json({ error: 'Invalid look payload.' }, { status: 400 })
	}

	const payload = parsed.data.payload
	if (JSON.stringify(payload).length > MAX_PAYLOAD_BYTES) {
		return NextResponse.json({ error: 'Payload too large.' }, { status: 413 })
	}

	const title = (payload.t ?? '').slice(0, 200)
	const schemaVersion = payload.v ?? 1

	try {
		const code = await createSharedLook(payload, title, schemaVersion, generateLookCode)
		return NextResponse.json({ code, url: `${SITE}/l/${code}` })
	} catch {
		return NextResponse.json({ error: 'Could not save the look.' }, { status: 500 })
	}
}
