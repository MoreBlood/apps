import { NextResponse } from 'next/server'
import { getSingleAppSlug } from '@/config/site-mode'
import { submitFeedbackOnServer } from '@/lib/feedback/server-submit'
import type { FeedbackPayload } from '@/types/feedback'

export async function POST(request: Request) {
	let body: FeedbackPayload
	try {
		body = (await request.json()) as FeedbackPayload
	} catch {
		return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 })
	}

	if (body.appSlug !== getSingleAppSlug()) {
		return NextResponse.json({ ok: false, error: 'Invalid app.' }, { status: 400 })
	}

	const result = await submitFeedbackOnServer(body)
	return NextResponse.json(result, { status: result.ok ? 200 : 502 })
}
