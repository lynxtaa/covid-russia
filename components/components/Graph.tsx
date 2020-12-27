import { format as formatDate, parseISO } from 'date-fns'
import { ru as ruLang } from 'date-fns/locale'
import { Line } from 'react-chartjs-2'

import { Region } from '../../lib/formatData'

type Props = {
	className?: string
	region: Region
	stats: { date: string; count: number }[]
}

export default function Graph({ className, stats, region }: Props) {
	return (
		<div className={className}>
			<Line
				options={{
					legend: { display: false },
					scales: {
						yAxes: [
							{
								ticks: {
									beginAtZero: true,
									callback: (label, index, labels) =>
										Number(label).toLocaleString('ru-RU'),
								},
							},
						],
					},
				}}
				data={{
					labels: stats
						.slice(-14)
						.map(c => formatDate(parseISO(c.date), 'd MMM', { locale: ruLang })),
					datasets: [
						{
							label: region,
							backgroundColor: 'rgb(255, 99, 132)',
							borderColor: 'rgb(255, 99, 132)',
							fill: false,
							data: stats
								.map((c, i) => (i > 0 ? c.count - stats[i - 1].count : c.count))
								.slice(-14),
						},
					],
				}}
			/>
		</div>
	)
}
