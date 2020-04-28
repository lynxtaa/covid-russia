import React, { useMemo } from 'react'
import { format as formatDate } from 'date-fns'
import { ru } from 'date-fns/locale'

import Link from './components/Link'
import useFetchCsv from './hooks/useFetchCsv'
import formatData from './utils/formatData'
import getRanges from './utils/getRanges'

import './Graph.css'

const SERIES_URL =
	'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'

const SERIES_RU_URL =
	'https://raw.githubusercontent.com/grwlf/COVID-19_plus_Russia/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_RU.csv'

export default function Graph() {
	const { rows: globalData, error: globalError } = useFetchCsv<string[]>(SERIES_URL)

	const { rows: ruData, error: ruError } = useFetchCsv<string[]>(SERIES_RU_URL)

	const error = globalError || ruError

	const info = useMemo(() => {
		if (!globalData || !ruData) {
			return null
		}

		const ruCases = formatData({
			data: globalData,
			dateFormat: 'M/d/yy',
			region: 'Russia',
			regionColumnName: 'Country/Region',
		})

		const spbCases = formatData({
			data: ruData,
			dateFormat: 'MM/dd/yy',
			region: 'Saint Petersburg',
			regionColumnName: 'Province_State',
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
	}, [globalData, ruData])

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
							href="https://github.com/grwlf/COVID-19_plus_Russia/blob/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_RU.csv"
							isExternal
						>
							.
						</Link>
					</h2>
					<div className="footer">
						Обновлено{' '}
						<Link
							href="https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
							isExternal
						>
							{formatDate(info.ru.ranges[0].to, 'd MMMM yyyy', { locale: ru })}
						</Link>
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
