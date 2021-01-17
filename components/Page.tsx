import { useState } from 'react'
import { GitHub } from 'react-feather'
import { useQuery } from 'react-query'

import { checkIfGrowing } from '../lib/checkIfGrowing'
import { Category, Region } from '../lib/formatData'
import { statsFetcher } from '../lib/statsFetcher'

import Button from './Button'
import Graph from './Graph'
import Icon from './Icon'
import Link from './Link'
import styles from './Page.module.css'
import Stats from './Stats'

export default function Page() {
	const [region, setRegion] = useState<Region>(Region.Spb)
	const [selected, setSelected] = useState<Category>(Category.Sick)

	const { data, error } = useQuery('stats', statsFetcher, {
		staleTime: 30 * 60 * 1000,
	})

	const currentRegion = data?.find(el => el.region === region)

	return (
		<div className={styles.page}>
			{error ? (
				<div className={styles.error}>
					Ой, что-то случилось :( <details>{String(error)}</details>
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
