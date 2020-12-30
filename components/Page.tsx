import { useState } from 'react'
import { GitHub } from 'react-feather'
import useSWR from 'swr'

import { checkIfGrowing } from '../lib/checkIfGrowing'
import { Category, DateStats, Region } from '../lib/formatData'
import { DATA_SOURCE_URL, statsFetcher } from '../lib/statsFetcher'

import Button from './Button'
import Graph from './Graph'
import Icon from './Icon'
import Link from './Link'
import styles from './Page.module.css'
import Stats from './Stats'

type Props = {
	initialData: {
		region: Region
		stats: DateStats[]
	}[]
}

export default function Page({ initialData }: Props) {
	const [region, setRegion] = useState<Region>(Region.Spb)
	const [selected, setSelected] = useState<Category>(Category.Sick)

	const { data, error } = useSWR<typeof initialData, Error>(
		DATA_SOURCE_URL,
		statsFetcher,
		{
			focusThrottleInterval: 30000,
			initialData,
			revalidateOnMount: true,
		},
	)

	const currentRegion = data?.find(el => el.region === region)

	return (
		<div className={styles.page}>
			{error ? (
				<div className={styles.error}>
					Ой, что-то случилось :( <details>{error}</details>
				</div>
			) : currentRegion && data ? (
				<>
					<h1 className={styles.question}>
						Заболеваемость
						<br />
						COVID&#8209;19{' '}
						<Link
							href="https://github.com/lynxtaa/covid-stats-russia/blob/master/covid_stats.csv"
							isExternal
						>
							{checkIfGrowing(currentRegion.stats) ? 'растёт.' : <>не&#32;растёт.</>}
						</Link>
					</h1>
					<Stats stats={currentRegion.stats} selected={selected} />
					<div className={styles.buttons}>
						<Button
							isActive={region === Region.Spb}
							onClick={() => setRegion(Region.Spb)}
						>
							Санкт-Петербург
						</Button>
						<Button isActive={region === Region.Ru} onClick={() => setRegion(Region.Ru)}>
							Россия
						</Button>
					</div>
					<Graph
						className={styles.graph}
						region={region}
						stats={currentRegion.stats.map(stat => ({
							date: stat.date,
							count: stat[selected],
						}))}
					/>
					<div className={styles.buttons}>
						{([
							[Category.Sick, 'выявлено'],
							[Category.Healed, 'излечилось'],
							[Category.Died, 'умерло'],
						] as const).map(([type, text]) => (
							<Button
								key={type}
								isActive={selected === type}
								onClick={() => setSelected(type)}
							>
								{text}
							</Button>
						))}
					</div>
					<Link
						className={styles.repoLink}
						href="https://github.com/lynxtaa/covid-russia"
						isExternal
					>
						<Icon icon={<GitHub />} size={1.5} />
					</Link>
				</>
			) : (
				<div className={styles.loading}>
					<span role="img" aria-label="virus">
						🦠
					</span>
				</div>
			)}
		</div>
	)
}
