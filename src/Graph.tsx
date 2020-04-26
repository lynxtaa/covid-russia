import React from 'react'
import * as Highcharts from 'highcharts'
import HighchartsData from 'highcharts/modules/data'
import HighchartsExporting from 'highcharts/modules/exporting'
import DarkUnicaTheme from 'highcharts/themes/dark-unica'
import HighchartsReact from 'highcharts-react-official'

HighchartsExporting(Highcharts)
HighchartsData(Highcharts)
// DarkUnicaTheme(Highcharts)

const SERIES_URL =
	'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'

const options: Highcharts.Options = {
	chart: {
		type: 'spline',
	},
	title: {
		text: 'Covid-19 Russia',
	},
	subtitle: {
		text: 'Просто график',
	},
	yAxis: {
		type: 'logarithmic',
		minorTickInterval: 1,
	},
	data: {
		csvURL: SERIES_URL,
		beforeParse(csv) {
			const rows = csv.split('\n')
			const marchStartsAtColumn = 43
			const russiaRow = rows.find((row) => /Russia/.test(row))!

			const dates = rows[0].split(',').slice(marchStartsAtColumn)

			const newCsv = [
				'Дата,Количество случаев',
				...russiaRow
					.split(',')
					.slice(marchStartsAtColumn)
					.map((cases, i) => `${dates[i]},${cases}`),
			].join('\n')

			return newCsv
		},
	},
}

export default function Graph() {
	return <HighchartsReact highcharts={Highcharts} options={options} />
}
