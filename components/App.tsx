import styles from './App.module.css'

type Props = {
	children?: React.ReactNode
}

export default function App({ children }: Props) {
	return <div className={styles.App}>{children}</div>
}
