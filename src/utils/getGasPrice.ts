import { parseUnits } from '@ethersproject/units'
import { useAggregatorStore } from '@state/aggregator/store'
import { GasSetting } from '@state/aggregator/types'

export enum GAS_PRICE {
	default = '0',
	fast = '500',
	instant = '1000',
	testnet = '10',
}

export const GAS_PRICE_GWEI = {
	default: null,
	fast: parseUnits(GAS_PRICE.fast, 'gwei').toString(),
	instant: parseUnits(GAS_PRICE.instant, 'gwei').toString(),
	testnet: parseUnits(GAS_PRICE.testnet, 'gwei').toString(),
}

export interface gasAPI {
	LastBlock: string
	SafeGasPrice: string
	ProposeGasPrice: string
	FastGasPrice: string
}

export async function getGasAPI() {
	const res = await fetch('https://api.ftmscan.com/api?module=gastracker&action=gasoracle&apikey=AZTJ36GVMVIV9FAJ5X4IW74MKIN33XV2VN', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	})
	const data = await res.json()
	const result: gasAPI = data?.result
	return { fast: result?.ProposeGasPrice, instant: result?.FastGasPrice }
}

/**
 * Function to return gasPrice outwith a react component
 */
const getGasPrice = async () => {
	const userGasSetting = useAggregatorStore.getState().gasSetting
	let ret
	try {
		if (userGasSetting === GasSetting.default) {
			ret = null
		} else {
			const { fast, instant } = await getGasAPI()
			if (userGasSetting === GasSetting.fast) {
				ret = fast
			} else if (userGasSetting === GasSetting.instant) {
				ret = (Number(instant) + 50).toString()
			}
		}
	} catch (e) {
		console.error(e)
		ret = null
	}

	return ret ? parseUnits(ret, 'gwei').toString() : null
}

export default getGasPrice
