import { DateStats } from '../../lib/formatData'
import { parseISO } from 'date-fns'

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
		diffSick: number
		diffDied: number
		diffHealed: number
	}[] = []

	for (let i = 0; i < numRanges; i++) {
		ranges.push({
			from: parseISO(cases[lastIndex - i - daysRange].date),
			to: parseISO(cases[lastIndex - i].date),
			diffSick: cases[lastIndex - i].sick - cases[lastIndex - i - daysRange].sick,
			diffDied: cases[lastIndex - i].died - cases[lastIndex - i - daysRange].died,
			diffHealed: cases[lastIndex - i].healed - cases[lastIndex - i - daysRange].healed,
		})
	}

	return ranges.reverse()
}
