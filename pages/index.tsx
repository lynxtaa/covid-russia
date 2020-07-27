import App from '../components/App'
import { GetStaticProps } from 'next'
import statsFetcher from '../lib/statsFetcher'
import Graph from '../components/Graph'
import { DateStats } from '../lib/formatData'

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

	return { props: { initialData } }
}
