import cn from 'classnames'
import React, { useMemo, useState } from 'react'
import { format as formatDate } from 'date-fns'
import { ru } from 'date-fns/locale'
import useSWR from 'swr'

import Link from './components/Link'
import formatData from './utils/formatData'
import getRanges from './utils/getRanges'
import csvFetcher from './utils/csvFetcher'

import styles from './Graph.module.css'
import Table from './Table'

const URL =
	'https://raw.githubusercontent.com/PhtRaveller/covid19-ru/master/data/covid_stats.csv'

export default function Graph() {
	const [selected, setSelected] = useState<'total' | 'died' | 'recovered'>('total')

	const { data, error } = useSWR<string[][], Error>(URL, csvFetcher, {
		focusThrottleInterval: 30000,
	})

	const info = useMemo(() => {
		if (!data) {
			return null
		}

		const ruCases = formatData({
			data: data,
			dateFormat: 'dd.MM.yyyy',
			region: 'Россия',
		})

		const spbCases = formatData({
			data: data,
			dateFormat: 'dd.MM.yyyy',
			region: 'Санкт-Петербург',
		})

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
							{info.ru.ranges[1].diffTotal > info.ru.ranges[0].diffTotal ? 'Да' : 'Нет'}.
						</Link>
					</h2>
					<h1 className={styles.question}>А&nbsp;в&nbsp;Санкт-Петербурге?</h1>
					<h2 className={styles.answer}>
						<Link
							href="https://github.com/PhtRaveller/covid19-ru/blob/master/data/covid_stats.csv"
							isExternal
						>
							{info.spb.ranges[1].diffTotal > info.spb.ranges[0].diffTotal ? 'Да' : 'Нет'}
							.
						</Link>
					</h2>
					<div>
						{([
							['total', 'выявлено'],
							['recovered', 'излечилось'],
							['died', 'умерло'],
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
