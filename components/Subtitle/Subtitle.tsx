import { type ReactNode } from 'react'
import styles from './Subtitle.module.scss'

interface SubtitleProps {
	children: ReactNode
}

export default function Subtitle({ children }: SubtitleProps) {
	return <p className={styles.subtitle}>{children}</p>
}

