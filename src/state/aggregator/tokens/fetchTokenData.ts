import { ParseFieldConfig, ParseFieldType, bn, decOffset, groupBy } from '@utils'
import multicallAndParse from '@utils/multicall'
import { SummitOracleV2 } from '@config/deployments'
import { NativePricingInput, TokenListItem, TokenListType } from '@config/tokens'
import { Token } from '../types'
import { chunkArray } from '../calls/callsUtils'
import { zeroAdd } from '@config/constants'

export const tokenDataFieldsBase: Record<string, ParseFieldConfig> = {
	tokenAddress: { type: ParseFieldType.address },
	symbol: { type: ParseFieldType.string },
	decimals: { type: ParseFieldType.number },
	bonus: { type: ParseFieldType.number },

	price: { type: ParseFieldType.number, stateField: 'nativeToTokenOutput' },

	userBalance: { type: ParseFieldType.bignumber },
}

export const tokenDataFields: Record<string, ParseFieldConfig> = {
	'0': {
		type: ParseFieldType.nested,
		stateField: 'token',
		nestedFields: tokenDataFieldsBase,
	},
}

export const price10StableFields: Record<string, ParseFieldConfig> = {
	'0': {
		type: ParseFieldType.number18Dec,
		stateField: 'price10Stable',
	},
}

export const parseTokenPriceAgainstStable = (amount: number | null) => {
	return amount == null || amount === 0 ? null : 1 / amount
}

export const parseTokenPriceAgainstNative = (nativePrice: number | null, amount: number, decimals = 18) => {
	const nativeSwapOutput = decOffset(amount, decimals)
	const nativeSwapInput = decOffset(NativePricingInput, 18)

	return nativeSwapInput == null || nativeSwapOutput == null || nativePrice == null ? null : nativePrice * (nativeSwapInput / nativeSwapOutput)
}

export const parseTokenRes = (nativePrice: number | null, tokenRes: any) => {
	const price = parseTokenPriceAgainstNative(nativePrice, tokenRes.nativeToTokenOutput, tokenRes.decimals)
	const userBalanceNum = decOffset(tokenRes.userBalance, tokenRes.decimals)
	const userBalanceUSD = userBalanceNum != null && price != null ? userBalanceNum * price : null
	return {
		address: tokenRes.tokenAddress,
		symbol: tokenRes.symbol,
		decimals: tokenRes.decimals,
		bonus: tokenRes.bonus,

		fetching: false,

		price,
		userBalance: bn(tokenRes.userBalance),
		userBalanceUSD,
	} as Omit<Token, 'ext'>
}

const _fetchTokenData = async (account: string, tokenAdd: string) => {
	const oracle = SummitOracleV2.address
	const calls = [
		{
			address: oracle,
			name: 'getPrice10Stable',
			params: [zeroAdd],
			fields: price10StableFields,
		},
		{
			address: oracle,
			name: 'getTokenData',
			params: [account, tokenAdd, NativePricingInput],
			fields: tokenDataFields,
		},
	]

	const res = await multicallAndParse(SummitOracleV2.abi, calls)
	if (res == null) return null

	const [{ price10Stable }, { token: tokenRes }] = res
	const nativePrice = parseTokenPriceAgainstStable(price10Stable)

	return parseTokenRes(nativePrice, tokenRes)
}

export const fetchTokenData = async (account: string, tokenItem: TokenListItem) => {
	const tokenData = await _fetchTokenData(account, tokenItem.address)
	if (tokenData == null) return null
	return {
		...tokenItem,
		...tokenData,
		symbol: tokenItem.symbol,
		fetching: false,
		isUserAdded: false,
	} as Token
}

export const fetchSearchedTokenData = async (account: string, tokenAdd: string) => {
	const tokenData = await _fetchTokenData(account, tokenAdd)
	if (tokenData == null) return null
	return {
		...tokenData,
		fetching: false,
		isUserAdded: true,
	} as Token
}

export const fetchTokenListData = async (account: string, tokenList: TokenListType, fetchIndex: number) => {
	const oracle = SummitOracleV2.address

	const nativePriceCall = {
		address: oracle,
		name: 'getPrice10Stable',
		params: [zeroAdd],
		fields: price10StableFields,
	}
	const calls = Object.keys(tokenList)
		.map((token) => ({
			address: oracle,
			name: 'getTokenData',
			params: [account, token, NativePricingInput],
			fields: tokenDataFields,
		}))
		.concat(nativePriceCall)

	const chunkedCalls = chunkArray(calls, 10)
	const res = await Promise.all(chunkedCalls.map((chunk) => multicallAndParse(SummitOracleV2.abi, chunk)))
	if (res == null) return { data: null, index: fetchIndex }

	const tokensData = res.flat()
	const { price10Stable } = tokensData.pop()
	const nativePrice = parseTokenPriceAgainstStable(price10Stable)

	const tokenListData: Token[] = tokensData.map(({ token: tokenRes }) => {
		return {
			...tokenList[tokenRes.tokenAddress],
			...parseTokenRes(nativePrice, tokenRes),
			symbol: tokenList[tokenRes.tokenAddress].symbol,
			fetching: false,
			isUserAdded: false,
		} as Token
	})

	return { data: groupBy(tokenListData, (item) => item.address), index: fetchIndex }
}
