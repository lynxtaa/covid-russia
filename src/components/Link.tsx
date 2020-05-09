import React from 'react'
import cn from 'classnames'

import styles from './Link.module.css'

type Props = {
	isExternal?: boolean
	children: React.ReactNode
	href: string
} & React.PropsWithoutRef<JSX.IntrinsicElements['a']>

export default function Link({ isExternal, children, className, ...rest }: Props) {
	const externalProps = isExternal
		? { target: '_blank', rel: 'noopener noreferrer' }
		: undefined

	return (
		<a {...externalProps} {...rest} className={cn(styles.link, className)}>
			{children}
		</a>
	)
}
