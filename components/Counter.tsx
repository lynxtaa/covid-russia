import { useSpring, animated, config } from 'react-spring'

const isServer = typeof window === 'undefined'

type Props = {
	children: number
}

export default function Counter({ children }: Props) {
	const { number } = useSpring({
		from: { number: isServer ? children : 0 },
		number: children,
		config: { ...config.default, clamp: true },
	})

	return (
		<animated.span>
			{number.to(value => Math.round(value).toLocaleString('ru-RU'))}
		</animated.span>
	)
}
