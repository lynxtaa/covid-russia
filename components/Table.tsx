import { format as formatDate, isToday, isYesterday, parseISO } from 'date-fns'
import { ru as ruLang } from 'date-fns/locale'

import last from './utils/last'
import Counter from './Counter'

import styles from './Table.module.css'
import { Category, DateStats } from '../lib/formatData'

type Props = {
	stats: DateStats[]
	selected: Category
}

export default function Table({ stats, selected }: Props) {
	const lastCaseDate = parseISO(last(stats).date)

	const lastCases = last(stats)[selected]
	const prevLastCases = stats[stats.length - 2][selected]

	return (
		<div className={styles.table}>
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
