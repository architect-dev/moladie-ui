/* eslint-disable @typescript-eslint/no-explicit-any */
import { ParseFieldConfig, ParseFieldType, bn, bnDecOffset, decOffset, eN } from '@utils'
import multicallAndParse from '@utils/multicall'
import { SummitOracleV2, WNATIVE } from '@config/deployments'
import { SwapData, SwapTradeData, Token } from './types'
import { NativePricingInput, TokenList, TokenListItem } from '@config/tokens'
import { parseTokenPriceAgainstStable, parseTokenRes, price10StableFields, tokenDataFieldsBase } from './tokens/fetchTokenData'
import { zeroAdd } from '@config/constants'
import { dbg } from './debug/debugStore'

const swapDataFields: Record<string, ParseFieldConfig> = {
	offer: {
		type: ParseFieldType.nested,
		nestedFields: {
			adapters: { type: ParseFieldType.addressArr },
			amounts: { type: ParseFieldType.bignumberArr },
			path: { type: ParseFieldType.addressArr },
			gasEstimate: { type: ParseFieldType.bignumber },
		},
	},
	tokenInAllowance: {
		type: ParseFieldType.number,
	},
}

type SwapDataParams = {
	account: string
	tokenInAmount: string
	tokenInItem: TokenListItem
	tokenOutItem: TokenListItem
	maxHops?: number
	tradeData: SwapTradeData
}

const tokenDataFields = (stateField: string): Record<string, ParseFieldConfig> => ({
	'0': {
		type: ParseFieldType.nested,
		stateField,
		nestedFields: tokenDataFieldsBase,
	},
})

const fetchSwapData = async ({ account, tokenInItem, tokenInAmount, tokenOutItem, maxHops = 3, tradeData }: SwapDataParams) => {
	const calls = [
		{
			address: SummitOracleV2.address,
			name: 'getPrice10Stable',
			params: [zeroAdd],
			fields: price10StableFields,
		},
		{
			address: SummitOracleV2.address,
			name: 'getTokenData',
			params: [account, tokenInItem.address, NativePricingInput],
			fields: tokenDataFields('tokenInData'),
		},
		{
			address: SummitOracleV2.address,
			name: 'getTokenData',
			params: [account, tokenOutItem.address, NativePricingInput],
			fields: tokenDataFields('tokenOutData'),
		},
		{
			address: SummitOracleV2.address,
			name: 'getSwapData',
			params: [
				account,
				eN(tokenInAmount, tokenInItem.decimals),
				tradeData.isNativeIn ? WNATIVE.address : tokenInItem.address,
				tradeData.isNativeOut ? WNATIVE.address : tokenOutItem.address,
				maxHops,
				tradeData.routePriority === 'least-gas' ? '1000000000' : '0',
			].filter(Boolean),
			fields: swapDataFields,
		},
	]

	const res = await multicallAndParse(SummitOracleV2.abi, calls) // Token data
	if (res == null) {
		dbg.error('Fetching swap data failed:', {
			contract: SummitOracleV2.address,
			calls,
		})
		return undefined
	}

	let resFlat: Record<string, any> = {}
	res.forEach((item: any) => (resFlat = { ...resFlat, ...item }))
	const { price10Stable, tokenInData, tokenOutData, offer, tokenInAllowance } = resFlat

	const nativePrice = parseTokenPriceAgainstStable(price10Stable)

	// Tokens data

	const tokenIn = {
		...tokenInItem,
		...parseTokenRes(nativePrice, tokenInData),
		symbol: tokenInItem.symbol,
		fetching: false,
	} as Token

	const tokenOut = {
		...tokenOutItem,
		...parseTokenRes(nativePrice, tokenOutData),
		symbol: tokenOutItem.symbol,
		fetching: false,
	} as Token

	// SWAP DATA

	const swapData: SwapData = offer
	if (tradeData.isWrapOrUnwrap) {
		swapData.valid = true
		swapData.tokenIn = tokenInItem.address
		swapData.tokenOut = tokenOutItem.address

		const tokenInAmountRaw = `${tokenInAmount}`
		swapData.tokenInAmount = tokenInAmountRaw ?? ''

		const tokenInAllowanceRaw = bnDecOffset(tokenInAllowance, tokenInItem.decimals)?.toJSON()
		const tokenInETHAllowanceRaw = tradeData.isNativeIn && tokenIn.userBalance != null ? `${tokenIn.userBalance}` : null
		swapData.tokenInAllowance = tokenInETHAllowanceRaw ?? tokenInAllowanceRaw ?? ''

		swapData.tokenOutAmount = swapData.tokenInAmount
	} else {
		swapData.valid = swapData.adapters.length > 0
		swapData.tokenIn = tokenInItem.address
		swapData.tokenOut = tokenOutItem.address

		const tokenInAmountRaw = bnDecOffset(swapData.amounts[0], tokenInItem.decimals)?.toJSON()
		swapData.tokenInAmount = tokenInAmountRaw ?? ''

		const tokenInAllowanceRaw = bnDecOffset(tokenInAllowance, tokenInItem.decimals)?.toJSON()
		swapData.tokenInAllowance = tokenInAllowanceRaw ?? ''

		const tokenOutAmount = decOffset(swapData.amounts[swapData.amounts.length - 1], tokenOutItem.decimals)
		const tokenOutAmountAfterTax =
			tokenOutAmount != null && (tokenInItem.tax != null || tokenOutItem.tax != null)
				? (tokenOutAmount * (10000 - (tokenInItem.tax ?? 0)) * (10000 - (tokenOutItem.tax ?? 0))) / (10000 * 10000)
				: null
		const trueTokenOutAmount = tokenOutAmountAfterTax ?? tokenOutAmount
		swapData.tokenOutAmount = trueTokenOutAmount != null ? `${trueTokenOutAmount}` : ''
	}

	const updatedAmounts = []

	// Update path to include taxes
	for (let i = 0; i < swapData.amounts.length; i++) {
		const tokenAdd = swapData.path[i].toLowerCase()
		const tax = TokenList[tokenAdd]?.tax
		if (tax != null && tax > 0) {
			updatedAmounts.push(
				bn(swapData.amounts[i])
					.times(10000 - tax)
					.div(10000)
					.toFixed(0)
			)
		} else {
			updatedAmounts.push(swapData.amounts[i])
		}
	}

	swapData.trade = tradeData
	swapData.amounts = [...updatedAmounts]

	dbg.log('Swap data:', { swapData, tokenIn, tokenOut })

	return { swapData, tokenIn, tokenOut }
}

export default fetchSwapData
