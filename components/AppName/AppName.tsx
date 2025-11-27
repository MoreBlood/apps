import { type ReactNode } from 'react'
import styles from './AppName.module.scss'

interface AppNameProps {
	children: ReactNode
}

export default function AppName({ children }: AppNameProps) {
	return <div className={styles.appName}>{children}</div>
}

