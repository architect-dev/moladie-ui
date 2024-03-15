import { TokenButton } from '@components/TokenButton'
import React, { useMemo } from 'react'
import { Column, Text, SummitPopUp } from '@uikit'
import { Nullable, bn, bnDisplay } from '@utils'
import TokenSelectModal, { DisabledReason, ModalVariant } from './TokenSelectModal'
import { useTokenData } from '@state/aggregator/tokens/tokenStore'
import { AddressRecord } from '@state/aggregator/types'

export const TokenSelectButton: React.FC<{
	token: Nullable<string>
	noTokenString: string
	setToken?: (token: string) => void
	selectedTokens?: string[]
	disabledReasons?: AddressRecord<DisabledReason>
	modalVariant: ModalVariant
	intro?: boolean
	className?: string
	changed?: boolean
	invertColor?: boolean
}> = ({ token, setToken, noTokenString, selectedTokens, disabledReasons, modalVariant, intro, className, changed, invertColor }) => {
	const tokenData = useTokenData(token)

	const selectedTokenBalance = useMemo(() => bnDisplay(tokenData?.userBalance, tokenData?.decimals, 3), [tokenData?.userBalance, tokenData?.decimals])
	const selectedTokenBalanceUsd = useMemo(
		() => (selectedTokenBalance != null && tokenData?.price != null ? bn(selectedTokenBalance).times(tokenData.price).toFixed(2) : null),
		[selectedTokenBalance, tokenData?.price]
	)

	return (
		<Column gap='18px' className={className}>
			<SummitPopUp
				modal
				button={<TokenButton token={token} noTokenString={noTokenString} changed={changed} invertColor={invertColor} />}
				popUpTitle={modalVariant === 'tokenIn' ? 'Select In Token:' : 'Select Out Token:'}
				popUpContent={
					<TokenSelectModal setToken={setToken} selectedTokens={selectedTokens ?? [token]} disabledReasons={disabledReasons} variant={modalVariant} />
				}
			/>
			{intro && selectedTokenBalance != null && (
				<Text>
					Balance: <b>{selectedTokenBalance}</b>
					<br />
					{selectedTokenBalanceUsd != null && (
						<Text small italic>
							(USD: ${selectedTokenBalanceUsd})
						</Text>
					)}
				</Text>
			)}
		</Column>
	)
}
