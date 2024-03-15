import React from 'react'
import { SummitButton, RowBetween } from '@uikit'
import TokenIconAndSymbol from './TokenIconAndSymbol'
import { Nullable } from '@utils'
import { GetProps } from 'react-redux'

type SummitButtonProps = GetProps<typeof SummitButton>

export const TokenButton: React.FC<
	{
		onClick?: () => void
		token: Nullable<string>
		noTokenString: string
		disabled?: boolean
		changed?: boolean
		invertColor?: boolean
		before?: React.ReactNode
		after?: React.ReactNode
	} & SummitButtonProps
> = React.memo(({ onClick, token, noTokenString, changed, disabled, before, after, invertColor = false, ...props }) => {
	return (
		<SummitButton
			onClick={onClick}
			disabled={disabled}
			padding='0px 12px'
			minWidth='90px'
			changed={changed}
			variant={invertColor ? 'inverted' : 'primary'}
			{...props}
		>
			{before != null && before}
			{token != null ? (
				<RowBetween gap='6px'>
					<TokenIconAndSymbol token={token} />
				</RowBetween>
			) : (
				noTokenString
			)}
			{after != null && after}
		</SummitButton>
	)
})
