import { parse as parseDate, isValid } from 'date-fns'

export type DateCase = { date: Date; numCases: number }

export default function formatData({
	data,
	dateFormat,
	region,
	regionColumnName,
}: {
	data: string[][]
	dateFormat: string
	region: string
	regionColumnName: string
}): DateCase[] {
	const [headerRow] = data
	const regionColumnIndex = headerRow.findIndex(col => col === regionColumnName)

	const datesStartAtIndex = headerRow.findIndex(maybeDate =>
		isValid(parseDate(maybeDate, dateFormat, new Date())),
	)

	const dates = headerRow.slice(datesStartAtIndex)

	const targetRow = data.find(row => row[regionColumnIndex] === region)

	if (!targetRow) {
		throw new Error(`No data for ${region}`)
	}

	return dates.map((date, index) => ({
		date: parseDate(date, 'M/d/yy', new Date()),
		numCases: Number(targetRow[index + datesStartAtIndex]),
	}))
}
