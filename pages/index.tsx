import { GetStaticProps } from 'next'

import App from '../components/App'
import Graph from '../components/Graph'
import { DateStats } from '../lib/formatData'
import { statsFetcher, DATA_SOURCE_URL } from '../lib/statsFetcher'

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
	const initialData = await statsFetcher(DATA_SOURCE_URL)

	return {
		props: { initialData },
		revalidate: 6 * 60 * 60, // every 6 hours
	}
}
