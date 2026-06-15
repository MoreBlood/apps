import type { AppRoadmapConfig, RoadmapColumn, RoadmapItem, RoadmapItemStatus } from '@/types/roadmap'

/** "Q3 2026" → "2026-q3"; year-only → "later". */
export function quarterIdFromEta(eta: string): string | null {
	const quarterMatch = eta.match(/Q([1-4])\s*(\d{4})/i)
	if (quarterMatch) {
		return `${quarterMatch[2]}-q${quarterMatch[1]}`
	}
	return null
}

export function resolveItemColumnId(item: RoadmapItem, config: AppRoadmapConfig): string {
	if (item.quarterId) return item.quarterId
	if (item.status === 'shipped') return 'released'
	if (item.status === 'in_progress') return config.currentQuarterId
	if (item.eta) {
		const fromEta = quarterIdFromEta(item.eta)
		if (fromEta && config.columns.some((c) => c.id === fromEta)) return fromEta
	}
	return 'later'
}

export function groupItemsByColumn(config: AppRoadmapConfig): { column: RoadmapColumn; items: RoadmapItem[] }[] {
	const buckets = new Map<string, RoadmapItem[]>()
	for (const col of config.columns) {
		buckets.set(col.id, [])
	}
	for (const item of config.items) {
		const columnId = resolveItemColumnId(item, config)
		const list = buckets.get(columnId) ?? buckets.get('later')
		if (!list) continue
		list.push(item)
	}
	return config.columns
		.map((column) => ({ column, items: buckets.get(column.id) ?? [] }))
		.filter((entry) => entry.items.length > 0)
}

export const STATUS_LABEL: Record<RoadmapItemStatus, string> = {
	shipped: 'Shipped',
	in_progress: 'In progress',
	planned: 'Planned'
}
