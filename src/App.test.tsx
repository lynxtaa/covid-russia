import React from 'react'
import { render } from '@testing-library/react'

import App from './App'

const fetch = window.fetch as jest.Mock

const firstRow = [
	'Province/State',
	'Country/Region',
	'Lat',
	'Long',
	'3/1/20',
	'3/2/20',
	'3/3/20',
	'3/4/20',
	'3/5/20',
	'3/6/20',
	'3/7/20',
	'3/8/20',
	'3/9/20',
].join(',')

it('отображает "Да", если экспоненциальный рост', async () => {
	fetch.mockResolvedValue({
		ok: true,
		text: () =>
			Promise.resolve(
				[
					firstRow,
					[
						'',
						'Russia',
						'60.0',
						'90.0',
						100,
						200,
						300,
						400,
						500,
						1000,
						2000,
						4000,
						8000,
					].join(','),
				].join('\n'),
			),
	})

	const { findByText } = render(<App />)

	await findByText('🦠')
	await findByText(/Да/)
	await findByText('9 марта 2020')
})

it('отображает "Нет", если не экспоненциальный рост', async () => {
	fetch.mockResolvedValue({
		ok: true,
		text: () =>
			Promise.resolve(
				[
					firstRow,
					[
						'',
						'Russia',
						'60.0',
						'90.0',
						100,
						200,
						300,
						400,
						500,
						1000,
						2000,
						4000,
						4100,
					].join(','),
				].join('\n'),
			),
	})

	const { findByText } = render(<App />)

	await findByText(/Нет/)
})

it('если была ошибка, отображает ошибку загрузки', async () => {
	fetch.mockResolvedValue({ ok: false, status: 404 })

	const { findByText } = render(<App />)

  await findByText(/что-то случилось/)
})
