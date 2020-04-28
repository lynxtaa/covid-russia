import { parse as parseCsv } from 'papaparse'
import { useState, useEffect } from 'react'

export default function useFetchCsv<TRow>(url: string) {
	const [state, setState] = useState<{ rows: TRow[] | undefined; error: null | string }>({
		error: null,
		rows: undefined,
	})

	useEffect(() => {
		let cancel = false

		setState({ error: null, rows: undefined })

		fetch(url)
			.then(response => {
				if (!response.ok) {
					throw new Error(`Error loading stats: ${response.status}`)
				}

				return response.text()
			})
			.then(csv => {
				const { data, errors } = parseCsv(csv)

				if (errors.length > 0) {
					throw new Error(errors[0].message)
				}

				if (!cancel) {
					setState({ rows: data, error: null })
				}
			})
			.catch(err => !cancel && setState({ rows: undefined, error: err.message }))

		return function () {
			cancel = true
		}
	}, [url])

	return state
}
