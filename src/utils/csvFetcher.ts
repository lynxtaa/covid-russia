import { parse as parseCsv } from 'papaparse'

export default async function csvFetcher(url: string) {
	const response = await fetch(url)

	if (!response.ok) {
		throw new Error(`Error loading stats: ${response.status}`)
	}

	const csv = await response.text()
	const { data, errors } = parseCsv(csv)

	if (errors.length > 0) {
		throw new Error(errors[0].message)
	}

	return data
}
