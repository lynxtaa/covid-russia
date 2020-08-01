import { GetStaticProps } from 'next'

import App from '../components/App'
import Graph from '../components/Graph'
import { DateStats } from '../lib/formatData'
import statsFetcher from '../lib/statsFetcher'

type Props = {
	initialData: {
		ruCases: DateStats[]
		spbCases: DateStats[]
	}
}

export default function Home({ initialData }: Props) {
	return (
		<div id="root">
			<App>
				<Graph initialData={initialData} />
			</App>
		</div>
	)
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const initialData = await statsFetcher(
		'https://raw.githubusercontent.com/PhtRaveller/covid19-ru/master/data/covid_stats.csv',
	)

	return {
		props: { initialData },
		revalidate: 12 * 60 * 60, // every 12 hours
	}
}
