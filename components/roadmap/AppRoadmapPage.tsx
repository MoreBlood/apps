import NextLink from 'next/link'
import { ArrowDownIcon, ArrowRightIcon } from '@radix-ui/react-icons'
import { Container, Link, Text } from '@radix-ui/themes'
import AppContactCta from '@/components/AppContactCta'
import type { AppConfig } from '@/config'
import { getRoadmapBySlug } from '@/config/roadmap-content'
import { groupItemsByColumn, STATUS_LABEL } from '@/lib/roadmap-grouping'
import type { AppRoadmapConfig, RoadmapColumn, RoadmapItem, RoadmapItemStatus } from '@/types/roadmap'

type Props = { app: AppConfig }

const STATUS_ORDER: RoadmapItemStatus[] = ['shipped', 'in_progress', 'planned']

function columnLaneClass(column: RoadmapColumn): string {
	switch (column.kind) {
		case 'released':
			return 'roadmap__lane--shipped'
		case 'later':
			return 'roadmap__lane--later'
		default:
			return 'roadmap__lane--quarter'
	}
}

function StatusBadge({ status }: { status: RoadmapItemStatus }) {
	return (
		<span className={`roadmap__status roadmap__status--${status}`}>{STATUS_LABEL[status]}</span>
	)
}

function RoadmapCard({ item }: { item: RoadmapItem }) {
	return (
		<article className={`roadmap__card roadmap__card--${item.status}`}>
			<StatusBadge status={item.status} />
			<h3 className="roadmap__card-title">{item.title}</h3>
			<p className="roadmap__card-desc">{item.description}</p>
			{item.eta && (
				<p className="roadmap__card-eta">
					<Text size="1" color="gray">
						Target: {item.eta}
					</Text>
				</p>
			)}
		</article>
	)
}

function RoadmapColumnBlock({
	column,
	items,
	isCurrent
}: {
	column: RoadmapColumn
	items: RoadmapItem[]
	isCurrent: boolean
}) {
	return (
		<section
			className={`roadmap__lane ${columnLaneClass(column)}`}
			aria-labelledby={`roadmap-col-${column.id}`}
		>
			<header className="roadmap__lane-head">
				<p className="roadmap__lane-eyebrow">
					{column.kind === 'released' ? 'Released' : column.kind === 'later' ? 'Backlog' : 'Quarter'}
				</p>
				<h2 className="roadmap__lane-title" id={`roadmap-col-${column.id}`}>
					{column.label}
					{isCurrent && <span className="roadmap__lane-now">Now</span>}
					<span className="roadmap__lane-count">{items.length}</span>
				</h2>
				{column.subtitle && <p className="roadmap__lane-lead">{column.subtitle}</p>}
			</header>
			<ul className="roadmap__stack">
				{items.map((item) => (
					<li key={item.title}>
						<RoadmapCard item={item} />
					</li>
				))}
			</ul>
		</section>
	)
}

function RoadmapBoard({ roadmap }: { roadmap: AppRoadmapConfig }) {
	const columns = groupItemsByColumn(roadmap)

	return (
		<div className="roadmap__board" role="list" aria-label="Product roadmap by quarter">
			{columns.map((entry, index) => (
				<div key={entry.column.id} className="roadmap__board-segment" role="listitem">
					<RoadmapColumnBlock
						column={entry.column}
						items={entry.items}
						isCurrent={entry.column.id === roadmap.currentQuarterId}
					/>
					{index < columns.length - 1 && (
						<div className="roadmap__phase-arrow" aria-hidden>
							<ArrowDownIcon />
						</div>
					)}
				</div>
			))}
		</div>
	)
}

export default function AppRoadmapPage({ app }: Props) {
	const roadmap = getRoadmapBySlug(app.slug)
	if (!roadmap) return null

	const columns = groupItemsByColumn(roadmap)
	const total = roadmap.items.length
	const quarterCount = columns.filter((c) => c.column.kind === 'quarter').length

	return (
		<article className="roadmap">
			<header className="roadmap__hero">
				<p className="roadmap__eyebrow">{app.appName}</p>
				<h1 className="roadmap__title">Product roadmap</h1>
				<p className="roadmap__intro">{roadmap.intro}</p>
				<Text as="p" size="1" color="gray" className="roadmap__updated">
					Last updated: {roadmap.lastUpdated} · {total} items · {quarterCount} quarters ahead
				</Text>
				<div className="roadmap__legend" aria-hidden>
					{STATUS_ORDER.map((status, index) => (
						<span key={status} className="roadmap__legend-step">
							<span className={`roadmap__legend-dot roadmap__legend-dot--${status}`} />
							<span>{STATUS_LABEL[status]}</span>
							{index < STATUS_ORDER.length - 1 && (
								<ArrowRightIcon className="roadmap__legend-arrow" />
							)}
						</span>
					))}
				</div>
			</header>

			<RoadmapBoard roadmap={roadmap} />

			<p className="roadmap__flow-hint">
				<ArrowDownIcon aria-hidden />
				<span>
					{columns.map((c, i) => (
						<span key={c.column.id}>
							{c.column.label} ({c.items.length})
							{i < columns.length - 1 ? ' ↓ ' : ''}
						</span>
					))}
				</span>
			</p>

			<Container size="2" className="roadmap__footer">
				<AppContactCta
					appSlug={app.slug}
					contactEmail={app.contactEmail}
					title="Missing something important?"
					lead={`Tell us what would make ${app.appName} better for you.`}
				/>
				{app.storeLink && (
					<Text as="p" size="2" mt="4">
						<Link asChild href={app.storeLink} target="_blank" rel="noopener noreferrer">
							Download on the App Store
						</Link>
					</Text>
				)}
				<Text as="p" size="1" color="gray" mt="4">
					<Link asChild>
						<NextLink href={`/${app.slug}`}>← Back to overview</NextLink>
					</Link>
				</Text>
			</Container>
		</article>
	)
}
