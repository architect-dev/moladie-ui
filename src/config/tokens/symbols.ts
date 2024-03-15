import { Nullable } from '@utils'

export const SymbolsMatcher: Record<string, string> = {
	USDC_LZ: 'USDC',
	USDC_AXL: 'USDC',
	'USDC.e': 'USDC',
	USDCe: 'USDC',
}

export const getMatchedSymbol = (symbol: Nullable<string>): string | null => {
	return symbol == null ? null : SymbolsMatcher[symbol] ?? symbol.replace('_MULTI', '').replace('_LZ', '').replace('_AXL', '')
}
