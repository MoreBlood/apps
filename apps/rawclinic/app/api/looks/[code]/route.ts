import { NextResponse } from 'next/server'
import { getSharedLook } from '@/lib/looks/db'

export const dynamic = 'force-dynamic'

/** GET /api/looks/<code> — резолвит payload по короткому коду (для импорта в приложении). */
export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
	const { code } = await params
	try {
		const row = await getSharedLook(code)
		if (!row) {
			return NextResponse.json({ error: 'Not found.' }, { status: 404 })
		}
		return NextResponse.json({ payload: row.payload })
	} catch {
		return NextResponse.json({ error: 'Lookup failed.' }, { status: 500 })
	}
}
