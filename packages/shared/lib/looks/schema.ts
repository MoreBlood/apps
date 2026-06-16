import { z } from 'zod'

/** Карточка-превью (палитра+чипы), посчитанная на iOS. Web/OG читают её как есть. */
export const SharedLookCardSchema = z.object({
	p: z.array(z.string()), // палитра (hex), тёмный→светлый
	a: z.string(), // акцент (hex)
	c: z.array(z.string()) // чипы
})

/** Самодостаточный payload расшаренного лука (короткие ключи — как кодирует iOS). */
export const SharedLookPayloadSchema = z.object({
	v: z.number().optional(), // schemaVersion
	t: z.string().max(200).optional(), // title
	r: z.record(z.string(), z.unknown()), // recipe (passthrough — нужен приложению для импорта)
	g: z.array(z.string()).optional(), // tags
	c: SharedLookCardSchema.optional() // card
})

export const PublishRequestSchema = z.object({
	payload: SharedLookPayloadSchema
})

export type SharedLookCard = z.infer<typeof SharedLookCardSchema>
export type SharedLookPayload = z.infer<typeof SharedLookPayloadSchema>
