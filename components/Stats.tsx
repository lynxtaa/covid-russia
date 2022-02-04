import { format as formatDate, isToday, isYesterday, parseISO } from 'date-fns'
import { ru as ruLang } from 'date-fns/locale'

import { Category, DateStats } from '../lib/formatData'

import Counter from './Counter'
import styles from './Stats.module.css'

type Props = {
	stats: DateStats[]
	selected: Category
}

export default function Stats({ stats, selected }: Props) {
	const lastCaseDate = parseISO(stats[stats.length - 1]!.date)

	const lastCases = stats[stats.length - 1]![selected]
	const prevLastCases = stats[stats.length - 2]![selected]

	return (
		<div className={styles.stats}>
			<div className={styles.counter}>
				<div>Всего</div>
				<div>
					<Counter>{lastCases}</Counter>
				</div>
			</div>
			<div className={styles.counter}>
				<div>
					{isToday(lastCaseDate)
						? 'Сегодня'
						: isYesterday(lastCaseDate)
						? 'Вчера'
						: formatDate(lastCaseDate, 'd MMM', { locale: ruLang })}
				</div>
				<div>
					<Counter>{lastCases - prevLastCases}</Counter>
				</div>
			</div>
		</div>
	)
}
