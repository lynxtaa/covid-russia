import { DateStats } from '../../lib/formatData'

export function checkIfGrowing(stats: DateStats[], { period = 7 } = {}) {
	const lastIndex = stats.length - 1

	const diffSick = stats[lastIndex].sick - stats[lastIndex - period].sick
	const diffSickPrev = stats[lastIndex - 1].sick - stats[lastIndex - period - 1].sick

	return diffSick > diffSickPrev
}
