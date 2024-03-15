import { FlexProps } from '@uikit'
import { grainyGradientMixin } from '@uikit/util/styledMixins'
import { SelectorWrapperBase } from '@uikit/widgets/Selector/styles'
import { transparentize } from 'polished'
import { useCallback } from 'react'
import styled from 'styled-components'
import { flexbox } from 'styled-system'

const InputWrapper = styled(SelectorWrapperBase)<FlexProps>`
	width: 100px;
	height: 34px;

	${flexbox}

	${({ theme }) => grainyGradientMixin(theme.isDark)}
`

export const TokenSearchInput = styled.input`
	isolation: isolate;
	width: 100%;
	min-height: 100%;
	max-height: 100%;
	height: 100%;
	border-radius: 16px;

	background: none;
	display: flex;
	text-align: center;
	border: none;
	outline: none;
	color: ${({ theme }) => theme.colors.text};
	::placeholder {
		color: ${({ theme }) => transparentize(0.5, theme.colors.text)};
	}
	font-size: 16px;

	padding: 0 16px;
	white-space: nowrap;
	text-overflow: ellipsis;
	z-index: 2;
	overflow: hidden;

	:focus {
		outline: none;
	}
`

const IntegerInput: React.FC<
	{
		val: string
		setVal: (code: string) => void
	} & FlexProps
> = ({ val, setVal, ...props }) => {
	const handleInput = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const input = event.target.value
			const sanitized = input.replace(/[^0-9.]/, '')
			setVal(sanitized)
		},
		[setVal]
	)

	return (
		<InputWrapper {...props}>
			<TokenSearchInput type='number' id='integer-input' placeholder='0' value={val} onChange={handleInput} autoComplete='off' spellCheck='false' />
		</InputWrapper>
	)
}

export default IntegerInput
