import React from 'react'
import { Spinner } from './Spinner'

const MDN_URL =
	'https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json'

/**
 * Creates and returns a new promise that resolves after a specified number of milliseconds.
 *
 * @param {number} ms the number of milliseconds to delay
 * @returns {Promise<undefined>} a promise that resolves with the value of `undefined` after the specified delay
 */
function delayMs(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

export function GroceryPanel(props) {
	const [isLoading, setIsLoading] = React.useState(false)
	const [error, setError] = React.useState(null)
	const [groceryData, setGroceryData] = React.useState([])

	function handleAddTodoClicked(item) {
		const todoName = `Buy ${item.name} (${item.price.toFixed(2)})`
		props.addTask(todoName)
	}

	async function fetchData(url) {
		console.log('fetching data from ' + url)
		setError(null)
		setIsLoading(true)

		if (url === '') {
			setIsLoading(false)
			return
		}

		delayMs(2000).then(() => {
			fetch(url)
				.then((response) => {
					if (!response.ok) {
						throw new Error(response.statusText)
					}
					console.log('loading', isLoading)
					return response.json()
				})
				.then((data) => {
					setGroceryData(data)
				})
				.catch((error) => {
					setError(error)
				})
			setIsLoading(false)
		})
	}

	function handleDropdownChange(changeEvent) {
		setGroceryData([])
		setError(null)
		fetchData(changeEvent.target.value)
	}

	return (
		<div>
			<h1 className="text-xl font-bold">Groceries prices today</h1>
			<label className="mb-4 flex gap-4 items-center">
				Get prices from:
				<select
					onChange={(e) => handleDropdownChange(e)}
					disabled={isLoading}
					className="border border-gray-300 p-1 rounded-sm disabled:opacity-50">
					<option value="">(None selected)</option>
					<option value={MDN_URL}>MDN</option>
					<option value="invalid">Who knows?</option>
				</select>
				{isLoading && <Spinner />}
				{error !== null && <p className="text-red-500">Something went wrong...</p>}
			</label>

			{groceryData.length > 0 ? (
				<PriceTable items={groceryData} onAddClicked={handleAddTodoClicked} />
			) : (
				'No data'
			)}
		</div>
	)
}

function PriceTable(props) {
	return (
		<table className="mt-4">
			<thead>
				<tr>
					<th className="text-left px-0">Name</th>
					<th className="px-4">Price</th>
				</tr>
			</thead>
			<tbody>
				{props.items.map((item) => (
					<PriceTableRow
						key={item.name}
						item={item}
						onAddClicked={() => props.onAddClicked(item)}
					/>
				))}
			</tbody>
		</table>
	)
}

function PriceTableRow({ item, onAddClicked }) {
	const buttonClasses = `italic px-2 rounded-sm border border-gray-300
        hover:bg-gray-100 active:bg-gray-200 cursor-pointer`
	return (
		<tr>
			<td className="px-0">{item.name}</td>
			<td className="px-4">${item.price.toFixed(2)}</td>
			<td className="px-4">
				<button className={buttonClasses} onClick={onAddClicked}>
					Add to todos
				</button>
			</td>
		</tr>
	)
}
