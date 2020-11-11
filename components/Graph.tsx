import cn from 'classnames'
import { useMemo, useState } from 'react'
import { format as formatDate } from 'date-fns'
import { ru } from 'date-fns/locale'
import useSWR from 'swr'

import Link from './components/Link'
import getRanges from './utils/getRanges'
import { DATA_SOURCE_URL, statsFetcher } from '../lib/statsFetcher'

import styles from './Graph.module.css'
import Table from './Table'
import { Category, DateStats } from '../lib/formatData'

type Props = {
	initialData: {
		ruCases: DateStats[]
		spbCases: DateStats[]
	}
}

export default function Graph({ initialData }: Props) {
	const [selected, setSelected] = useState<Category>(Category.Sick)

	const { data, error } = useSWR<typeof initialData, Error>(
		DATA_SOURCE_URL,
		statsFetcher,
		{
			focusThrottleInterval: 30000,
			initialData,
			revalidateOnMount: true,
		},
	)

	const info = useMemo(() => {
		if (!data) {
			return null
		}

		const { ruCases, spbCases } = data

		return {
			ru: {
				ranges: getRanges({ cases: ruCases }),
				cases: ruCases,
			},
			spb: {
				ranges: getRanges({ cases: spbCases }),
				cases: spbCases,
			},
		}
	}, [data])

	return (
		<div className={styles.container}>
			{error ? (
				<div className={styles.error}>
					Ой, что-то случилось :( <details>{error}</details>
				</div>
			) : info ? (
				<>
					<h1 className={styles.question}>
						Рост случаев COVID-19&nbsp;в России экспоненциальный?
					</h1>
					<h2 className={styles.answer}>
						<Link href="https://aatishb.com/covidtrends/" isExternal>
							{info.ru.ranges[1].diffSick > info.ru.ranges[0].diffSick ? 'Да' : 'Нет'}.
						</Link>
					</h2>
					<h1 className={styles.question}>А&nbsp;в&nbsp;Санкт-Петербурге?</h1>
					<h2 className={styles.answer}>
						<Link
							href="https://github.com/lynxtaa/covid-stats-russia/blob/master/covid_stats.csv"
							isExternal
						>
							{info.spb.ranges[1].diffSick > info.spb.ranges[0].diffSick ? 'Да' : 'Нет'}.
						</Link>
					</h2>
					<div>
						{([
							[Category.Sick, 'выявлено'],
							[Category.Healed, 'излечилось'],
							[Category.Died, 'умерло'],
						] as const).map(([type, text]) => (
							<button
								key={type}
								type="button"
								className={cn(
									styles.statsButton,
									selected === type && styles.activeButton,
								)}
								onClick={() => setSelected(type)}
							>
								{text}
							</button>
						))}
					</div>
					<Table ru={info.ru} spb={info.spb} selected={selected} />
					<div className={styles.footer}>
						Обновлено {formatDate(info.ru.ranges[1].to, 'd MMMM yyyy', { locale: ru })}
					</div>
				</>
			) : (
				<div className={styles.loading}>
					<span role="img" aria-label="virus">
						🦠
					</span>
				</div>
			)}
		</div>
	)
}
