import React, { useState, useEffect, useMemo } from 'react'
import { parse as parseCsv } from 'papaparse'
import { parse as parseDate, format as formatDate } from 'date-fns'
import { ru } from 'date-fns/locale'

import Link from './components/Link'

import './Graph.css'

const SERIES_URL =
	'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'

type DateCases = (readonly [Date, number])[]

function formatData(data: string[][]): DateCases {
	const COUNTRY_NAME_INDEX = 1
	const DATES_START_AT_INDEX = 4

	const dates = data[0]
	const russiaData = data.find((row) => /Russia/.test(row[COUNTRY_NAME_INDEX]))

	if (!russiaData) {
		throw new Error('Error founding data for Russia')
	}

	return dates
		.slice(DATES_START_AT_INDEX)
		.map(
			(date, index) =>
				[
					parseDate(date, 'M/d/yy', new Date()),
					Number(russiaData[index + DATES_START_AT_INDEX]),
				] as const,
		)
}

export default function Graph() {
	const [dateCases, setDateCases] = useState<DateCases | null>(null)
	const [error, setError] = useState('')

	useEffect(() => {
		fetch(SERIES_URL)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Error loading stats: ${response.status}`)
				}
				return response.text()
			})
			.then((csv) => {
				const { data, errors } = parseCsv(csv)
				if (errors.length > 0) {
					throw errors[0]
				}
				setDateCases(formatData(data))
			})
			.catch((err: Error) => setError(err.message))
	}, [])

	const info = useMemo(() => {
		if (!dateCases) {
			return null
		}

		const DAYS_IN_WEEK = 7

		const lastIndex = dateCases.length - 1

		const [lastDate, lastConfirmed] = dateCases[lastIndex]
		const [, dayBeforeConfirmed] = dateCases[lastIndex - 1]
		const [, weekAgoConfirmed] = dateCases[lastIndex - DAYS_IN_WEEK]
		const [, weekAndOneDayAgoConfirmed] = dateCases[lastIndex - 1 - DAYS_IN_WEEK]

		const delta1 = lastConfirmed - weekAgoConfirmed
		const delta2 = dayBeforeConfirmed - weekAndOneDayAgoConfirmed

		return {
			isExponential: delta1 > delta2,
			updatedAt: formatDate(lastDate, 'd MMMM yyyy', { locale: ru }),
		}
	}, [dateCases])

	return (
		<div className="Graph">
			{error ? (
				<p className="error">
					Ой, что-то случилось :( <details>{error}</details>{' '}
				</p>
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
					<div className="footer">Обновлено {info.updatedAt}</div>
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
