import { parse as parseCsv } from 'papaparse'

import formatData, { DateStats, Region } from './formatData'

export const DATA_SOURCE_URL =
	'https://raw.githubusercontent.com/lynxtaa/covid-stats-russia/master/covid_stats.csv'

export async function statsFetcher(): Promise<{ region: Region; stats: DateStats[] }[]> {
	const response = await fetch(DATA_SOURCE_URL)

	if (!response.ok) {
		throw new Error(`Error loading stats: ${response.status}`)
	}

	const csv = await response.text()
	const { data, errors } = parseCsv<string[]>(csv)

	if (errors.length > 0) {
		throw new Error(errors[0].message)
	}

	return Object.values(Region).map(region => ({
		region,
		stats: formatData({ data, region }),
	}))
}
