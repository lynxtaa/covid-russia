import React from 'react'
import { format as formatDate, isToday, isYesterday } from 'date-fns'
import { ru as ruLang } from 'date-fns/locale'

import last from './utils/last'
import Counter from './Counter'

import styles from './Table.module.css'
import { DateStats } from './utils/formatData'

type Props = {
	ru: {
		ranges: {
			from: Date
			to: Date
			diffTotal: number
			diffDied: number
			diffRecovered: number
		}[]
		cases: DateStats[]
	}
	spb: {
		ranges: {
			from: Date
			to: Date
			diffTotal: number
			diffDied: number
			diffRecovered: number
		}[]
		cases: DateStats[]
	}
	selected: 'total' | 'died' | 'recovered'
}

export default function Table({ ru, spb, selected }: Props) {
	return (
		<table className={styles.table}>
			<thead>
				<tr>
					<th></th>
					<th align="right">всего</th>
					<th align="right">
						{isToday(last(ru.cases).date)
							? 'сегодня'
							: isYesterday(last(ru.cases).date)
							? 'вчера'
							: formatDate(last(ru.cases).date, 'd MMM', { locale: ruLang })}
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
	)
}
