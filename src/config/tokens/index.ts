const CHAIN_ID = 0

import TokenListFantom from './fantom/TokenList.json'
import TokenListBlastTest from './blast-test/TokenList.json'
import TokenListBlast from './blast/TokenList.json'

// AGGREGATOR STUFF
export type TokenListItem = { address: string; ext: string; decimals: number; tax?: number; symbol: string; sort?: number; base?: boolean }
export type TokenListType = Record<string, TokenListItem>

const TokenListChain: Record<number, TokenListType> = {
	[250]: TokenListFantom,
	[81457]: TokenListBlast,
	[168587773]: TokenListBlastTest,
}

export const TokenList = TokenListChain[CHAIN_ID]

const ChainNativePricingInput: Record<number, string> = {
	[250]: '1000000000000000000',
	[81457]: '3000000000000000',
	[168587773]: '3000000000000000',
}

export const NativePricingInput = ChainNativePricingInput[CHAIN_ID]
