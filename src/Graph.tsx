import React, { useMemo } from 'react'
import { format as formatDate } from 'date-fns'
import { ru } from 'date-fns/locale'

import Link from './components/Link'
import useFetchCsv from './hooks/useFetchCsv'
import formatData from './utils/formatData'
import getRanges from './utils/getRanges'

import './Graph.css'

const URL =
	'https://raw.githubusercontent.com/PhtRaveller/covid19-ru/master/data/covid_stats.csv'

export default function Graph() {
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

		const ruRanges = getRanges({ cases: ruCases })
		const spbRanges = getRanges({ cases: spbCases })

		return {
			ru: {
				ranges: ruRanges,
				isExponential: ruRanges[0].diff > ruRanges[1].diff,
			},
			spb: {
				ranges: spbRanges,
				isExponential: spbRanges[0].diff > spbRanges[1].diff,
			},
		}
	}, [rows])

	return (
		<div className="Graph">
			{error ? (
				<div className="error">
					Ой, что-то случилось :( <details>{error}</details>
				</div>
			) : info ? (
				<>
					<h1 className="question">
						Рост случаев COVID-19&nbsp;в России экспоненциальный?
					</h1>
					<h2 className="answer">
						{info.ru.isExponential ? 'Да' : 'Нет'}
						<Link href="https://aatishb.com/covidtrends/" isExternal>
							.
						</Link>
					</h2>
					<h1 className="question">А&nbsp;в&nbsp;Санкт-Петербурге?</h1>
					<h2 className="answer">
						{info.spb.isExponential ? 'Да' : 'Нет'}
						<Link
							href="https://github.com/PhtRaveller/covid19-ru/blob/master/data/covid_stats.csv"
							isExternal
						>
							.
						</Link>
					</h2>
					<div className="footer">
						Обновлено {formatDate(info.ru.ranges[0].to, 'd MMMM yyyy', { locale: ru })}
					</div>
				</>
			) : (
				<div className="loading">
					<span role="img" aria-label="virus">
						🦠
					</span>
				</div>
			)}
		</div>
	)
}
