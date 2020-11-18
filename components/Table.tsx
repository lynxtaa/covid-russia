import { format as formatDate, isToday, isYesterday, parseISO } from 'date-fns'
import { ru as ruLang } from 'date-fns/locale'
import { Line } from 'react-chartjs-2'

import last from './utils/last'
import Counter from './Counter'

import styles from './Table.module.css'
import { Category, DateStats } from '../lib/formatData'

type Props = {
	ru: { cases: DateStats[] }
	spb: { cases: DateStats[] }
	selected: Category
}

export default function Table({ ru, spb, selected }: Props) {
	return (
		<div className={styles.chartContainer}>
			<table className={styles.table}>
				<thead>
					<tr>
						<th></th>
						<th align="right">всего</th>
						<th align="right">
							{isToday(parseISO(last(ru.cases).date))
								? 'сегодня'
								: isYesterday(parseISO(last(ru.cases).date))
								? 'вчера'
								: formatDate(parseISO(last(ru.cases).date), 'd MMM', { locale: ruLang })}
						</th>
					</tr>
				</thead>
				<tbody>
					{[
						{ region: 'СПб', stats: spb },
						{ region: 'Россия', stats: ru },
					].map(({ region, stats }) => {
						const lastCases = last(stats.cases)[selected]
						const prevLastCases = stats.cases[stats.cases.length - 2][selected]

						return (
							<tr key={region}>
								<td>{region}</td>
								<td align="right">
									<Counter>{lastCases}</Counter>
								</td>
								<td align="right">
									<Counter>{lastCases - prevLastCases}</Counter>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
			<Line
				data={{
					labels: spb.cases
						.slice(-14)
						.map(c => formatDate(parseISO(c.date), 'd MMM', { locale: ruLang })),
					datasets: [
						{
							label: 'СПб',
							backgroundColor: 'rgb(255, 99, 132)',
							borderColor: 'rgb(255, 99, 132)',
							data: spb.cases
								.map((c, i) =>
									i > 0 ? c[selected] - spb.cases[i - 1][selected] : c[selected],
								)
								.slice(-14),
						},
					],
				}}
			/>
		</div>
	)
}
