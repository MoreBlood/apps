type Props = {
	palette: string[]
	accent: string
	chips: string[]
	title: string
}

/** Превью-карточка лука для web. Тот же визуал, что в iOS `LookCardView` и в OG-картинке
 * (общий источник — посчитанный на iOS `card`: палитра + чипы). */
export default function LookCard({ palette, accent, chips, title }: Props) {
	const colors = palette.length >= 2 ? palette : [accent, accent]
	const gradient = `linear-gradient(135deg, ${colors.join(', ')})`

	return (
		<div
			style={{
				position: 'relative',
				width: '100%',
				aspectRatio: '1.6 / 1',
				borderRadius: 24,
				overflow: 'hidden',
				background: gradient,
				boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
			}}
		>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: 'linear-gradient(to bottom, transparent 38%, rgba(0,0,0,0.46))'
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: 20,
					right: 20,
					bottom: 18,
					display: 'flex',
					flexDirection: 'column',
					gap: 10
				}}
			>
				{chips.length > 0 && (
					<div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
						{chips.slice(0, 4).map((chip) => (
							<span
								key={chip}
								style={{
									fontSize: 12,
									fontWeight: 600,
									color: '#fff',
									background: 'rgba(255,255,255,0.18)',
									backdropFilter: 'blur(6px)',
									padding: '4px 8px',
									borderRadius: 999
								}}
							>
								{chip}
							</span>
						))}
					</div>
				)}
				<span
					style={{
						fontSize: 26,
						fontWeight: 700,
						color: '#fff',
						textShadow: '0 1px 4px rgba(0,0,0,0.25)'
					}}
				>
					{title}
				</span>
			</div>
		</div>
	)
}
