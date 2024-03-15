import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Column, RowBetween, Text } from '@uikit'
import { SelectorWrapperBase } from '@uikit/widgets/Selector/styles'
import { Nullable } from '@utils'
import { grainyGradientMixin } from '@uikit/util/styledMixins'
import { transparentize } from 'polished'

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

interface TokenInputProps {
	label?: string
	value: Nullable<string>
	setValue: (val: string) => void

	placeholder?: string
	disabled?: boolean
	isLocked?: boolean
	invalidReason: Nullable<string>
}

const AmountSelector: React.FC<TokenInputProps> = ({
	label,
	value,
	setValue,

	placeholder = '0.0',
	disabled,
	isLocked,
	invalidReason,
}) => {
	const isInvalid = invalidReason != null && invalidReason !== ''

	const handleChange = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			setValue(e.currentTarget.value)
		},
		[setValue]
	)

	return (
		<Column width='100%' maxWidth='360px' gap='4px'>
			<RowBetween>{label != null && <Text>{label}:</Text>}</RowBetween>
			<StyledInputWrapper disabled={disabled} isLocked={isLocked} invalid={isInvalid}>
				<InputRow>
					<Column width='100%' alignItems='flex-end'>
						<InputWrapper>
							<StyledInput disabled={disabled || isLocked} placeholder={placeholder} value={value ?? ''} onChange={handleChange} invalid={isInvalid} />
						</InputWrapper>
					</Column>
				</InputRow>
			</StyledInputWrapper>

			<Text red paddingTop='4px' textAlign='end' style={{ height: '18px' }}>
				{invalidReason}
			</Text>
		</Column>
	)
}

export default AmountSelector
