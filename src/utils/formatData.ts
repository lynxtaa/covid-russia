import { parse as parseDate } from 'date-fns'

export type DateCase = { date: Date; numCases: number }

export default function formatData({
	category = 'total',
	data,
	dateFormat,
	region,
}: {
	category?: 'total' | 'recovered' | 'died'
	data: string[][]
	dateFormat: string
	region: string
}): DateCase[] {
	const [headerRow, ...dateRows] = data
	const regionColumnIndex = headerRow.findIndex(col => col === region)

	if (regionColumnIndex === -1) {
		throw new Error(`No data for ${region}`)
	}

	return dateRows
		.filter(dateRow => dateRow[1] === category)
		.map(dateRow => ({
			date: parseDate(dateRow[0], dateFormat, new Date()),
			numCases: Number(dateRow[regionColumnIndex]),
		}))
}
