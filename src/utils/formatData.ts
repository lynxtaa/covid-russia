import { parse as parseDate } from 'date-fns'

export type DateStats = {
	date: Date
	total: number
	recovered: number
	died: number
}

enum Category {
	total = 'total',
	recovered = 'recovered',
	died = 'died',
}

export default function formatData({
	data,
	dateFormat,
	region,
}: {
	data: string[][]
	dateFormat: string
	region: string
}): DateStats[] {
	const [headerRow, ...dateRows] = data
	const regionColumnIndex = headerRow.findIndex(col => col === region)

	if (regionColumnIndex === -1) {
		throw new Error(`No data for ${region}`)
	}

	const getStats = (category: Category) =>
		dateRows
			.filter(dateRow => dateRow[1] === category)
			.map(dateRow => ({
				date: parseDate(dateRow[0], dateFormat, new Date()),
				numCases: Number(dateRow[regionColumnIndex]),
			}))

	const total = getStats(Category.total)

	const recovered = getStats(Category.recovered)

	const died = getStats(Category.died)

	return total.map((stats, i) => ({
		date: stats.date,
		total: stats.numCases,
		recovered: recovered[i].numCases,
		died: died[i].numCases,
	}))
}
