import { useEffect, useState } from 'react'
import { bn } from './bigNum'

export interface gasAPI {
	LastBlock: string
	SafeGasPrice: string
	ProposeGasPrice: string
	FastGasPrice: string
}

export async function getGasAPI() {
	const res = await fetch('https://api.blastscan.io/api?module=proxy&action=eth_gasPrice&apikey=J2VJMPTPE34YVW2NIIBWRWPE78H2RVE7UI', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	})
	const data = await res.json()
	const result = bn(data?.result).toJSON()
	console.log({ data, result })

	return result
}

export const useGasPrice = () => {
	const [gas, setGas] = useState<string | null>(null)
	useEffect(() => {
		const getGas = async () => {
			setGas(await getGasAPI())
		}
		getGas()
	}, [])
	return gas
}
