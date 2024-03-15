import React, { useCallback, useEffect, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Column, RowBetween, Text } from '@uikit'
import { TokenSelectButton } from '@components/TokenSelect/TokenSelectButton'
import { SelectorWrapperBase } from '@uikit/widgets/Selector/styles'
import { Nullable, bn, bnDecOffset, bnMax, checkDecimalValidity } from '@utils'
import { grainyGradientMixin, pressableMixin } from '@uikit/util/styledMixins'
import { transparentize } from 'polished'
import { TokenIndicator } from '@components/TokenSelect/TokenIndicator'
import { useTokenData } from '@state/aggregator/tokens/tokenStore'
import { AddressRecord, Token } from '@state/aggregator/types'
import { zeroAdd } from '@config/constants'
import { DisabledReason } from '@components/TokenSelect/TokenSelectModal'

const StyledInputWrapper = styled(SelectorWrapperBase)`
	position: relative;
	align-items: center;

	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	width: 100%;
	max-width: 440px;

	${({ disabled }) =>
		disabled &&
		css`
			/* opacity: 0.5; */
		`}

	${({ isLocked }) =>
		isLocked &&
		css`
			filter: grayscale(1);
			opacity: 0.5;
		`}

  ${({ theme }) => grainyGradientMixin(theme.isDark)}
`

const ThinRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	height: 24px;
	width: 100%;
	padding: 0 16px;
	gap: 16px;
	z-index: 2;
`
const InputRow = styled(ThinRow)`
	height: 64px;
	/* border: 1px solid ${({ theme }) => transparentize(0.75, theme.colors.text)}; */
	border-left-width: 0px;
	border-right-width: 0px;
	justify-content: space-between;
	padding: 0px 12px;
`

const InputWrapper = styled.div<{ changed?: boolean }>`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	position: relative;
	height: 28px;

	${({ changed, theme }) =>
		changed &&
		css`
			:after {
				content: '*';
				color: ${theme.colors.warning};
				font-size: 14px;
				font-weight: bold;
				position: absolute;
				top: -4px;
				right: -8px;
			}
		`}
`

const InputTextStyle = css`
	font-size: 20px;
	text-align: right;
	letter-spacing: 1px;
	color: ${({ theme }) => theme.colors.text};
`

export const StyledInputText = styled(Text)`
	${InputTextStyle};
`

export const StyledInput = styled.input<{ invalid?: boolean }>`
	width: 100%;
	padding-right: 30px;
	background: none;
	border: 0;
	flex: 1;
	margin: 0;
	padding: 0;
	outline: none;
	${InputTextStyle};
	color: ${({ theme, invalid }) => (invalid ? theme.colors.failure : theme.colors.text)};
	::placeholder {
		color: ${({ theme, invalid }) => transparentize(0.5, invalid ? theme.colors.failure : theme.colors.text)};
	}
`

const TextButton = styled.div<{ buttonText?: boolean }>`
	cursor: pointer;
	font-size: 14px;
	line-height: 24px;
	cursor: pointer;
	padding: 0px 8px;
	margin: 0px -8px;
	color: ${({ theme, buttonText }) => (buttonText ? theme.colors.buttonText : theme.colors.text)};

	${pressableMixin};

	&:hover {
		font-weight: bold;
		text-decoration: underline;
	}
`

interface TokenInputProps {
	label?: string
	token: Nullable<string>
	setToken?: (token: string) => void
	value: Nullable<string>
	setValue: (val: string, max: string, token: Token) => void

	disabledReasons?: AddressRecord<DisabledReason>

	placeholder?: string
	disabled?: boolean
	isLocked?: boolean
	invalidReason: Nullable<string>

	tokenChanged?: boolean
	amountChanged?: boolean

	tokenSelectDisabled?: boolean

	max: Nullable<string>

	tokenSelectEnabled?: boolean
	valueEnabled?: boolean

	balanceText?: string
	isNativeDeposit?: boolean
	loading?: boolean
}

const TokenAndAmountSelector: React.FC<TokenInputProps> = ({
	token,
	setToken,
	value,
	setValue,
	label,

	disabledReasons,

	placeholder = '0.0',
	disabled,
	isLocked,
	invalidReason,

	tokenChanged,
	amountChanged,

	valueEnabled = true,

	tokenSelectDisabled,
	loading = false,
}) => {
	const tokenData = useTokenData(token)
	const isInvalid = invalidReason != null && invalidReason !== ''

	const balance =
		tokenData == null || tokenData?.userBalance == null || tokenData?.decimals == null
			? null
			: bnDecOffset(tokenData.userBalance, tokenData.decimals)?.toString()

	const handleChange = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			if (balance == null || tokenData == null) return
			setValue(e.currentTarget.value, `${balance}`, tokenData)
		},
		[setValue, balance, tokenData]
	)

	// If full balance or token changes, call handleChange to update error
	useEffect(() => {
		if (value == null || balance == null || tokenData == null) return
		setValue(value, `${balance}`, tokenData)
	}, [balance, value, setValue, tokenData])

	const handleSelectMax = useCallback(() => {
		if (balance == null || tokenData == null) return
		let balanceWithBuffer: string | undefined = tokenData.address === zeroAdd ? bnMax(bn(0), bn(balance).minus(0.0001))?.toString() : balance
		if (balanceWithBuffer != null && !checkDecimalValidity(balanceWithBuffer, tokenData.decimals)) {
			balanceWithBuffer = bn(balanceWithBuffer).toFixed(tokenData.decimals)
		}
		setValue(`${balanceWithBuffer}`, `${balanceWithBuffer}`, tokenData)
	}, [setValue, balance, tokenData])

	const valUsd = useMemo(() => {
		if (tokenData?.price == null || value == null || value === '') return null
		return `$${bn(value).times(tokenData.price).toFixed(2)}`
	}, [tokenData, value])

	const isZero = useMemo(() => {
		return value == null || value === '' || isNaN(parseFloat(value)) || parseFloat(value) === 0
	}, [value])

	return (
		<Column width='100%' maxWidth='360px' gap='4px'>
			<RowBetween>
				{label != null && <Text>{label}:</Text>}
				{valueEnabled && <TextButton onClick={handleSelectMax}>Σ: {balance != null ? bn(balance).toFixed(4) : '...'}</TextButton>}
				{!valueEnabled && <Text>Σ: {balance != null ? bn(balance).toFixed(4) : '...'}</Text>}
			</RowBetween>
			<StyledInputWrapper disabled={disabled || valueEnabled == false} isLocked={isLocked} invalid={isInvalid}>
				<InputRow>
					{tokenSelectDisabled ? (
						<TokenIndicator token={token} />
					) : (
						<TokenSelectButton
							token={token}
							setToken={setToken}
							noTokenString='SELECT'
							disabledReasons={disabledReasons}
							modalVariant='tokenIn'
							changed={tokenChanged}
						/>
					)}
					<Column alignItems='flex-end'>
						<InputWrapper changed={amountChanged}>
							{loading ? (
								<StyledInputText>...</StyledInputText>
							) : (
								<StyledInput
									disabled={disabled || isLocked || !valueEnabled}
									placeholder={placeholder}
									value={value ?? ''}
									onChange={handleChange}
									invalid={isInvalid}
								/>
							)}
						</InputWrapper>
						{valUsd != null && !loading && !isZero && (
							<Text small red={isInvalid} lineHeight='14px'>
								~{valUsd}
							</Text>
						)}
					</Column>
				</InputRow>
			</StyledInputWrapper>

			<Text red paddingTop='4px' textAlign='end' style={{ height: '18px' }}>
				{invalidReason}
			</Text>
			{tokenData != null && tokenData.tax != null && (
				<Text warn={tokenData.tax > 500} paddingTop='4px' textAlign='center'>
					{tokenData.symbol} has a {(tokenData.tax / 100).toFixed(1)}% tax on buy/sell
				</Text>
			)}
		</Column>
	)
}

export default TokenAndAmountSelector
