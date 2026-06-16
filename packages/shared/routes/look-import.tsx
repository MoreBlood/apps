import { Container, Flex, Heading, Section, Text } from '@radix-ui/themes'
import type { Metadata } from 'next'
import LandingStoreButton from '@/components/landing/LandingStoreButton'
import LookCard from '@/components/looks/LookCard'
import { getAppBySlug, toLandingAppInfo } from '@/config'
import { getSharedLook } from '@/lib/looks/db'
import { decodeSelfContainedLook } from '@/lib/looks/decode'
import type { SharedLookCard, SharedLookPayload } from '@/lib/looks/schema'

type Props = { params: Promise<{ token: string }> }

type ResolvedLook = { title: string; card: SharedLookCard; tags: string[] }

/**
 * Страница ссылки `/l/<code>`.
 *
 * Если RAW Clinic установлен, iOS перехватывает Universal Link и открывает приложение —
 * страница НЕ грузится. Её видят только без приложения: показываем карточку лука + CTA.
 * Короткий код → из БД; старая «fat»-ссылка (payload в URL) → декодим токен на сервере.
 */
async function loadLook(token: string): Promise<ResolvedLook | null> {
	// Короткий код → из БД; если нет (старая «fat»-ссылка / БД недоступна) → декод токена.
	let payload: SharedLookPayload | undefined
	try {
		payload = (await getSharedLook(token))?.payload
	} catch {
		payload = undefined
	}
	if (!payload) {
		payload = decodeSelfContainedLook(token) ?? undefined
	}
	if (!payload?.c) return null
	const title = typeof payload.t === 'string' && payload.t.trim() ? payload.t : 'Shared look'
	return { title, card: payload.c, tags: payload.g ?? [] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { token } = await params
	const look = await loadLook(token)
	return {
		title: look ? `${look.title} · RAW Clinic look` : 'Open a look · RAW Clinic',
		description: look
			? `${look.title} — a color look for RAW Clinic${look.card.c.length ? ` (${look.card.c.join(', ')})` : ''}.`
			: 'Add a shared look to your RAW Clinic collection.',
		robots: { index: false, follow: false }
	}
}

export default async function LookImportRoute({ params }: Props) {
	const { token } = await params
	const look = await loadLook(token)
	const app = getAppBySlug('rawclinic')
	const landingApp = app ? toLandingAppInfo(app) : null

	return (
		<Section size="3">
			<Container size="1" px="4">
				<Flex direction="column" align="center" gap="5" style={{ textAlign: 'center' }}>
					{look ? (
						<>
							<Text size="2" color="gray" style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>
								RAW Clinic look
							</Text>
							<div style={{ width: '100%', maxWidth: 440 }}>
								<LookCard palette={look.card.p} accent={look.card.a} chips={look.card.c} title={look.title} />
							</div>
							<Heading size="6">{look.title}</Heading>
							{look.card.c.length > 0 && (
								<Text size="3" weight="medium">
									{look.card.c.join(' · ')}
								</Text>
							)}
							<Text size="2" color="gray">
								A color look for RAW Clinic. Open this link on your iPhone or iPad with the app installed to add it to
								your collection.
							</Text>
						</>
					) : (
						<>
							<Heading size="7">Open this look in RAW Clinic</Heading>
							<Text size="4" color="gray">
								Open this link on your iPhone or iPad with RAW Clinic installed to add it to your collection.
							</Text>
						</>
					)}
					{landingApp && <LandingStoreButton app={landingApp} label="Get RAW Clinic" size="large" />}
					<Text size="2" color="gray">
						Already installed? This link opens the app automatically.
					</Text>
				</Flex>
			</Container>
		</Section>
	)
}
