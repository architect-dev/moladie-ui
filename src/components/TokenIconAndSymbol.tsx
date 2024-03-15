import React, { memo } from 'react'
import { TokenSymbolImage } from '@uikit'
import { getMatchedSymbol } from '@config/tokens/symbols'
import { useTokenData } from '@state/aggregator/tokens/tokenStore'

const TokenIconAndSymbol: React.FC<{ token: string; center?: boolean; noHighlight?: boolean }> = ({ token, center = false, noHighlight = false }) => {
	const tokenData = useTokenData(token)
	const matchedSymbol = getMatchedSymbol(tokenData?.symbol)
	return (
		<>
			{center ? <span className='transparent'>{tokenData?.symbol}</span> : undefined}
			<TokenSymbolImage symbol={matchedSymbol ?? ''} ext={tokenData?.ext ?? 'svg'} width={24} height={24} bonus={noHighlight ? undefined : tokenData?.bonus} />
			{tokenData?.symbol}
		</>
	)
}

export default memo(TokenIconAndSymbol)
