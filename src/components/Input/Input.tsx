import React from 'react'
import styled, { css } from 'styled-components'
import { HighlightedText } from '@uikit'
import { SelectorWrapperBase } from '@uikit/widgets/Selector/styles'

export interface InputProps {
	endAdornment?: React.ReactNode
	onChange: (e: React.FormEvent<HTMLInputElement>) => void
	tokenSymbol?: string
	placeholder?: string
	startAdornment?: React.ReactNode
	value: string
	disabled?: boolean
	isLocked?: boolean
	invalid?: boolean
}

const Input: React.FC<InputProps> = ({
	tokenSymbol,
	endAdornment,
	onChange,
	placeholder,
	startAdornment,
	value,
	disabled = false,
	isLocked = false,
	invalid = false,
}) => {
	return (
		<StyledInputWrapper disabled={disabled} isLocked={isLocked} invalid={invalid}>
			{!!startAdornment && startAdornment}
			<InputWrapper>
				<StyledInput disabled={disabled || isLocked} placeholder={placeholder} value={value} onChange={onChange} invalid={invalid} />
				{!!tokenSymbol && (
					<SymbolText fontSize='12px' monospace red={invalid}>
						{tokenSymbol}
					</SymbolText>
				)}
			</InputWrapper>
			{!!endAdornment && endAdornment}
		</StyledInputWrapper>
	)
}

const StyledInputWrapper = styled(SelectorWrapperBase)`
	position: relative;
	align-items: center;

	border-radius: 16px;
	display: flex;
	height: 52px;
	padding: 0 ${(props) => props.theme.spacing[3]}px;

	${({ disabled }) =>
		disabled &&
		css`
			opacity: 0.5;
		`}

	${({ isLocked }) =>
		isLocked &&
		css`
			filter: grayscale(1);
			opacity: 0.5;
		`}
`

const InputWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
`

const SymbolText = styled(HighlightedText)`
	text-shadow: none;
`

export const StyledInput = styled.input<{ invalid?: boolean }>`
	width: 100%;
	background: none;
	border: 0;
	font-size: 22px;
	font-weight: bold;
	font-style: italic;
	flex: 1;
	height: 56px;
	margin: 0;
	padding: 0;
	outline: none;
	color: ${({ theme, invalid }) => (invalid ? theme.colors.failure : theme.colors.text)};
`

export default Input
