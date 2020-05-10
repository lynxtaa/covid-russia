import { DateStats } from './formatData'

export default function getRanges({
	cases,
	numRanges = 2,
	daysRange = 7,
}: {
	cases: DateStats[]
	numRanges?: number
	daysRange?: number
}) {
	const lastIndex = cases.length - 1

	const ranges: {
		from: Date
		to: Date
		diffTotal: number
		diffDied: number
		diffRecovered: number
	}[] = []

	for (let i = 0; i < numRanges; i++) {
		ranges.push({
			from: cases[lastIndex - i - daysRange].date,
			to: cases[lastIndex - i].date,
			diffTotal: cases[lastIndex - i].total - cases[lastIndex - i - daysRange].total,
			diffDied: cases[lastIndex - i].died - cases[lastIndex - i - daysRange].died,
			diffRecovered:
				cases[lastIndex - i].recovered - cases[lastIndex - i - daysRange].recovered,
		})
	}

	return ranges.reverse()
}
