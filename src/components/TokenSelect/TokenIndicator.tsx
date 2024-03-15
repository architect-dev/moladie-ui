import { transparentize } from 'polished'
import React from 'react'
import styled from 'styled-components'
import { TokenSymbolImage } from '@uikit'
import { Nullable } from '@utils'
import { useTokenData } from '@state/aggregator/tokens/tokenStore'

const IndicatorWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	min-width: 100px;
	padding: 0 12px 0 2px;
	border-radius: 14px;
	height: 28px;
	border: 1px solid ${({ theme }) => transparentize(0.75, theme.colors.text)};

	text-align: center;
	color: ${({ theme }) => theme.colors.text};
	font-weight: 600;
	font-size: 14px;
	letter-spacing: 0.03em;
	line-height: 1;
	gap: 6px;
`

export const TokenIndicator: React.FC<{
	token: Nullable<string>
	className?: string
}> = ({ token, className }) => {
	const tokenData = useTokenData(token)

	return (
		<IndicatorWrapper className={className}>
			{tokenData?.symbol != null && <TokenSymbolImage bonus={tokenData?.bonus} symbol={tokenData?.symbol} ext={tokenData?.ext} width={24} height={24} />}
			{tokenData?.symbol}
		</IndicatorWrapper>
	)
}
