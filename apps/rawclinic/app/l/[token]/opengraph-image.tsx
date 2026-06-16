import { ImageResponse } from 'next/og'
import { getSharedLook } from '@/lib/looks/db'
import { decodeSelfContainedLook } from '@/lib/looks/decode'

export const runtime = 'nodejs'
export const alt = 'RAW Clinic look'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** Разворачивает ссылку в мессенджерах/соцсетях карточкой лука (палитра + чипы + имя). */
export default async function Image({ params }: { params: Promise<{ token: string }> }) {
	const { token } = await params

	let title = 'RAW Clinic look'
	let palette = ['#2a2a30', '#6a6a72']
	let chips: string[] = []
	// Короткий код → из БД; иначе декодим самодостаточный токен. Дефолт — общая карточка.
	let payload = await getSharedLook(token)
		.then((row) => row?.payload)
		.catch(() => undefined)
	if (!payload) payload = decodeSelfContainedLook(token) ?? undefined
	const card = payload?.c
	if (card) {
		palette = card.p.length >= 2 ? card.p : [card.a, card.a]
		chips = card.c ?? []
		if (typeof payload?.t === 'string' && payload.t.trim()) title = payload.t
	}

	const gradient = `linear-gradient(135deg, ${palette.join(', ')})`

	return new ImageResponse(
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-end',
				backgroundImage: gradient,
				padding: 72
			}}
		>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
					{chips.slice(0, 4).map((chip) => (
						<div
							key={chip}
							style={{
								display: 'flex',
								fontSize: 30,
								color: '#fff',
								background: 'rgba(255,255,255,0.22)',
								padding: '10px 22px',
								borderRadius: 999
							}}
						>
							{chip}
						</div>
					))}
				</div>
				<div style={{ display: 'flex', fontSize: 88, fontWeight: 700, color: '#fff' }}>{title}</div>
				<div style={{ display: 'flex', fontSize: 34, color: 'rgba(255,255,255,0.85)', marginTop: 10 }}>
					RAW Clinic look
				</div>
			</div>
		</div>,
		{ ...size }
	)
}
