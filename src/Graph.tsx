import cn from 'classnames'
import React, { useMemo, useState } from 'react'
import { format as formatDate } from 'date-fns'
import { ru } from 'date-fns/locale'

import Link from './components/Link'
import useFetchCsv from './hooks/useFetchCsv'
import formatData from './utils/formatData'
import getRanges from './utils/getRanges'
import Counter from './Counter'

import styles from './Graph.module.css'

const URL =
	'https://raw.githubusercontent.com/PhtRaveller/covid19-ru/master/data/covid_stats.csv'

export default function Graph() {
	const [selected, setSelected] = useState<'total' | 'died' | 'recovered'>('total')

	const { rows, error } = useFetchCsv<string[]>(URL)

	const info = useMemo(() => {
		if (!rows) {
			return null
		}

		const ruCases = formatData({
			data: rows,
			dateFormat: 'dd.MM.yyyy',
			region: 'Россия',
		})

		const spbCases = formatData({
			data: rows,
			dateFormat: 'dd.MM.yyyy',
			region: 'Санкт-Петербург',
		})

		return {
			ru: {
				ranges: getRanges({ cases: ruCases }),
				total: ruCases[ruCases.length - 1].total,
				recovered: ruCases[ruCases.length - 1].recovered,
				died: ruCases[ruCases.length - 1].died,
			},
			spb: {
				ranges: getRanges({ cases: spbCases }),
				total: spbCases[spbCases.length - 1].total,
				recovered: spbCases[spbCases.length - 1].recovered,
				died: spbCases[spbCases.length - 1].died,
			},
		}
	}, [rows])

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
						{info.ru.ranges[1].diffTotal > info.ru.ranges[0].diffTotal ? 'Да' : 'Нет'}
						<Link href="https://aatishb.com/covidtrends/" isExternal>
							.
						</Link>
					</h2>
					<h1 className={styles.question}>А&nbsp;в&nbsp;Санкт-Петербурге?</h1>
					<h2 className={styles.answer}>
						{info.spb.ranges[1].diffTotal > info.spb.ranges[0].diffTotal ? 'Да' : 'Нет'}
						<Link
							href="https://github.com/PhtRaveller/covid19-ru/blob/master/data/covid_stats.csv"
							isExternal
						>
							.
						</Link>
					</h2>
					<div>
						{(['total', 'recovered', 'died'] as const).map(type => (
							<button
								key={type}
								type="button"
								className={cn(
									styles.statsButton,
									selected === type && styles.activeButton,
								)}
								onClick={() => setSelected(type)}
							>
								{type === 'total'
									? 'выявлено'
									: type === 'recovered'
									? 'излечилось'
									: 'умерло'}
							</button>
						))}
					</div>
					<table className={styles.table}>
						<thead>
							<tr>
								<th></th>
								<th align="right">всего</th>
								<th align="right">за 7 дней</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>СПб</td>
								<td align="right">
									<Counter>{info.spb[selected]}</Counter>
								</td>
								<td align="right">
									<Counter>
										{
											info.spb.ranges[1][
												selected === 'total'
													? 'diffTotal'
													: selected === 'died'
													? 'diffDied'
													: 'diffRecovered'
											]
										}
									</Counter>
								</td>
							</tr>
							<tr>
								<td>Россия</td>
								<td align="right">
									<Counter>{info.ru[selected]}</Counter>
								</td>
								<td align="right">
									<Counter>
										{
											info.ru.ranges[1][
												selected === 'total'
													? 'diffTotal'
													: selected === 'died'
													? 'diffDied'
													: 'diffRecovered'
											]
										}
									</Counter>
								</td>
							</tr>
						</tbody>
					</table>
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
