import { GetStaticProps } from 'next'
import { QueryClient } from 'react-query'
import { dehydrate, DehydratedState } from 'react-query/hydration'

import App from '../components/App'
import Page from '../components/Page'
import { statsFetcher } from '../lib/statsFetcher'

type Props = {
	dehydratedState: DehydratedState
}

export default function Home() {
	return (
		<App>
			<Page />
		</App>
	)
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const queryClient = new QueryClient()

	await queryClient.prefetchQuery('stats', statsFetcher)

	return {
		props: { dehydratedState: dehydrate(queryClient) },
		revalidate: 6 * 60 * 60, // every 6 hours
	}
}
