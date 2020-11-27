import { GetStaticProps } from 'next'

import App from '../components/App'
import Page from '../components/Page'
import { DateStats, Region } from '../lib/formatData'
import { statsFetcher, DATA_SOURCE_URL } from '../lib/statsFetcher'

type Props = {
	initialData: {
		region: Region
		stats: DateStats[]
	}[]
}

export default function Home({ initialData }: Props) {
	return (
		<App>
			<Page initialData={initialData} />
		</App>
	)
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const initialData = await statsFetcher(DATA_SOURCE_URL)

	return {
		props: { initialData },
		revalidate: 6 * 60 * 60, // every 6 hours
	}
}
