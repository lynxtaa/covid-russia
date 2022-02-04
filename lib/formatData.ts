import { parseISO } from 'date-fns'

export enum Category {
	Sick = 'sick',
	Healed = 'healed',
	Died = 'died',
}

export type DateStats = {
	date: string
	[Category.Sick]: number
	[Category.Healed]: number
	[Category.Died]: number
}

export enum Region {
	Ru = 'Россия',
	Spb = 'Санкт-Петербург',
	Msk = 'Москва',
}

export default function formatData({
	data,
	region,
}: {
	data: string[][]
	region: Region
}): DateStats[] {
	const [headerRow, ...dateRows] = data
	const regionColumnIndex = headerRow!.findIndex(col => col === region)

	if (regionColumnIndex === -1) {
		throw new Error(`No data for ${region}`)
	}

	const getStats = (category: Category) =>
		dateRows
			.filter(dateRow => dateRow[1] === category)
			.map(dateRow => ({
				date: parseISO(dateRow[0]!).toISOString(),
				numCases: Number(dateRow[regionColumnIndex]),
			}))

	const sick = getStats(Category.Sick)

	const healed = getStats(Category.Healed)

	const died = getStats(Category.Died)

	return sick.map((stats, i) => ({
		date: stats.date,
		sick: stats.numCases,
		healed: healed[i]!.numCases,
		died: died[i]!.numCases,
	}))
}
