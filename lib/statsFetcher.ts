import { parse as parseCsv } from 'papaparse'

import formatData, { DateStats } from './formatData'

export const DATA_SOURCE_URL =
	'https://raw.githubusercontent.com/lynxtaa/covid-stats-russia/master/covid_stats.csv'

export async function statsFetcher(
	url: string,
): Promise<{
	ruCases: DateStats[]
	spbCases: DateStats[]
}> {
	const response = await fetch(url)

	if (!response.ok) {
		throw new Error(`Error loading stats: ${response.status}`)
	}

	const csv = await response.text()
	const { data, errors } = parseCsv<string[]>(csv)

	if (errors.length > 0) {
		throw new Error(errors[0].message)
	}

	const ruCases = formatData({
		data,
		dateFormat: 'dd.MM.yyyy',
		region: 'Россия',
	})

	const spbCases = formatData({
		data,
		dateFormat: 'dd.MM.yyyy',
		region: 'Санкт-Петербург',
	})

	return { ruCases, spbCases }
}
