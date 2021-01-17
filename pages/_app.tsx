import { AppProps } from 'next/app'
import Head from 'next/head'
import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'

import 'focus-visible'

import '../styles/global.css'

const queryClient = new QueryClient()

const App = ({ Component, pageProps }: AppProps) => (
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<Hydrate state={pageProps.dehydratedState}>
				<Head>
					<meta charSet="utf-8" />
					<link rel="icon" href="/favicon.ico" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta
						name="description"
						content="Дневная статистика случаев по регионам и стране в целом"
					/>

					<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
					<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
					<link rel="manifest" href="/site.webmanifest" />
					<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
					<meta name="msapplication-TileColor" content="#2b5797" />
					<meta name="theme-color" content="#282c35" />

					<title>COVID Russia</title>
				</Head>
				<Component {...pageProps} />
			</Hydrate>
		</QueryClientProvider>
	</StrictMode>
)

export default App
