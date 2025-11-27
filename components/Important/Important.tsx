import { type ReactNode } from 'react'
import styles from './Important.module.scss'

interface ImportantProps {
	children: ReactNode
}

export default function Important({ children }: ImportantProps) {
	return <div className={styles.important}>{children}</div>
}

