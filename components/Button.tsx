import cn from 'classnames'

import styles from './Button.module.css'

type Props = {
	children?: React.ReactNode
	isActive?: boolean
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export default function Button({ children, isActive = false, onClick }: Props) {
	return (
		<button
			type="button"
			className={cn(styles.Button, isActive && styles.ButtonActive)}
			onClick={onClick}
		>
			{children}
		</button>
	)
}
