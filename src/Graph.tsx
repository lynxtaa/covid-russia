import React, { useState, useEffect, useMemo } from 'react'
import { parse as parseCsv } from 'papaparse'
import { parse as parseDate, format as formatDate, isValid } from 'date-fns'
import { ru } from 'date-fns/locale'

import Link from './components/Link'

import './Graph.css'

const SERIES_URL =
	'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'

type DateCase = { date: Date; numCases: number }

function formatData(data: string[][]): DateCase[] {
	const COUNTRY_NAME_INDEX = 1

	const datesStartAtIndex = data[0].findIndex(maybeDate =>
		isValid(parseDate(maybeDate, 'M/d/yy', new Date())),
	)

	const dates = data[0].slice(datesStartAtIndex)

	const russiaData = data.find(row => /Russia/.test(row[COUNTRY_NAME_INDEX]))

	if (!russiaData) {
		throw new Error('Error founding data for Russia')
	}

	return dates.map((date, index) => ({
		date: parseDate(date, 'M/d/yy', new Date()),
		numCases: Number(russiaData[index + datesStartAtIndex]),
	}))
}

export default function Graph() {
	const [dateCases, setDateCases] = useState<DateCase[] | null>(null)
	const [error, setError] = useState('')

	useEffect(() => {
		fetch(SERIES_URL)
			.then(response => {
				if (!response.ok) {
					throw new Error(`Error loading stats: ${response.status}`)
				}
				return response.text()
			})
			.then(csv => {
				const { data, errors } = parseCsv(csv)
				if (errors.length > 0) {
					throw new Error(errors[0].message)
				}
				setDateCases(formatData(data))
			})
			.catch((err: Error) => setError(err.message))
	}, [])

	const info = useMemo(() => {
		if (!dateCases) {
			return null
		}

		const DAYS_RANGE = 7

		const lastIndex = dateCases.length - 1

		const lastDate = dateCases[lastIndex].date

		const delta1 =
			dateCases[lastIndex].numCases - dateCases[lastIndex - DAYS_RANGE].numCases
		const delta2 =
			dateCases[lastIndex - 1].numCases - dateCases[lastIndex - DAYS_RANGE - 1].numCases

		return {
			isExponential: delta1 > delta2,
			updatedAt: formatDate(lastDate, 'd MMMM yyyy', { locale: ru }),
		}
	}, [dateCases])

	return (
		<div className="Graph">
			{error ? (
				<div className="error">
					Ой, что-то случилось :( <details>{error}</details>{' '}
				</div>
			) : info ? (
				<>
					<h1 className="question">
						Рост случаев COVID19&nbsp;в России экспоненциальный?
					</h1>
					<h2 className="answer">
						{info.isExponential ? 'Да' : 'Нет'}
						<Link href="https://aatishb.com/covidtrends/" isExternal>
							.
						</Link>
					</h2>
					<div className="footer">
						Обновлено{' '}
						<Link
							href="https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
							isExternal
						>
							{info.updatedAt}
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
