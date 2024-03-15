import { grainyGradientMixin } from '@uikit/util/styledMixins'
import { SelectorWrapperBase } from '@uikit/widgets/Selector/styles'
import { transparentize } from 'polished'
import { useCallback } from 'react'
import styled from 'styled-components'

const InputWrapper = styled(SelectorWrapperBase)`
	width: 300px;
	height: 70px;
	${({ theme }) => grainyGradientMixin(theme.isDark)}
`

export const TokenSearchInput = styled.input`
	isolation: isolate;
	min-height: 32px;
	height: 32px;
	max-height: 32px;
	border-radius: 16px;

	background: none;
	display: flex;
	width: 100%;
	height: 100%;
	min-height: 100%;
	text-align: center;
	border: none;
	outline: none;
	color: ${({ theme }) => theme.colors.text};
	::placeholder {
		color: ${({ theme }) => transparentize(0.5, theme.colors.text)};
	}
	font-size: 22px;

	padding: 0 16px;
	white-space: nowrap;
	text-overflow: ellipsis;
	z-index: 2;
	overflow: hidden;

	:focus {
		outline: none;
	}
`

const ReferralCodeInput: React.FC<{
	code: string
	setCode: (code: string) => void
}> = ({ code, setCode }) => {
	const handleInput = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const input = event.target.value
			setCode(
				input
					// eslint-disable-next-line no-useless-escape
					.replace(/[^\w\s\']|_/g, '_')
					.replace(/ /g, '_')
					.toUpperCase()
			)
		},
		[setCode]
	)
	return (
		<InputWrapper>
			<TokenSearchInput
				width='100%'
				type='text'
				id='code-input'
				placeholder='REFERRAL CODE'
				value={code}
				onChange={handleInput}
				autoComplete='off'
				spellCheck='false'
				minLength={3}
				maxLength={15}
			/>
		</InputWrapper>
	)
}

export default ReferralCodeInput
