import { RowCenter, Text } from '@uikit'
import { grainyGradientMixin } from '@uikit/util/styledMixins'
import { SelectorWrapperBase } from '@uikit/widgets/Selector/styles'
import { transparentize } from 'polished'
import { useCallback } from 'react'
import styled from 'styled-components'

const InputWrapper = styled(SelectorWrapperBase)`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: 70px;
	${({ theme }) => grainyGradientMixin(theme.isDark)}
`

const TokenSearchInput = styled.input`
	isolation: isolate;
	min-height: 32px;
	height: 32px;
	max-height: 32px;
	border-radius: 16px;
	width: 70px;

	background: none;
	display: flex;
	width: 100%;
	border: none;
	outline: none;
	color: ${({ theme }) => theme.colors.text};
	::placeholder {
		color: ${({ theme }) => transparentize(0.5, theme.colors.text)};
		font-weight: 300;
	}
	font-size: 14px;

	white-space: nowrap;
	text-overflow: ellipsis;
	z-index: 2;
	overflow: hidden;
	text-align: center;
	font-weight: bold;

	:focus {
		outline: none;
	}
`

export const SlippageCustomInput: React.FC<{ custom: string; valueIsCustom: boolean; setCustom: (input: string) => void }> = ({
	custom,
	valueIsCustom,
	setCustom,
}) => {
	const selected = valueIsCustom && custom != ''
	const handleInput = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const input = event.target.value
			setCustom(input)
		},
		[setCustom]
	)
	return (
		<RowCenter flex={0} alignItems='center' gap='6px'>
			<Text bold={selected}>
				<pre>{selected ? '(' : ' '}</pre>
			</Text>
			<InputWrapper>
				<TokenSearchInput
					type='number'
					id='slippage-custom-input'
					placeholder='0.0'
					value={valueIsCustom ? custom : ''}
					onChange={handleInput}
					autoComplete='off'
					spellCheck='false'
					autoFocus={false}
				/>
			</InputWrapper>
			<Text bold={selected}>
				<pre>{selected ? '%)' : '% '}</pre>
			</Text>
		</RowCenter>
	)
}
