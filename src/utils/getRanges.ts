import { DateCase } from './formatData'

export default function getRanges({
	cases,
	numRanges = 2,
	daysRange = 7,
}: {
	cases: DateCase[]
	numRanges?: number
	daysRange?: number
}) {
	const lastIndex = cases.length - 1

	const ranges: { from: Date; to: Date; diff: number }[] = []

	for (let i = 0; i < numRanges; i++) {
		ranges.push({
			from: cases[lastIndex - i - daysRange].date,
			to: cases[lastIndex - i].date,
			diff: cases[lastIndex - i].numCases - cases[lastIndex - i - daysRange].numCases,
		})
	}

	return ranges
}
