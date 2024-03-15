import { grainyGradientMixin } from '@uikit/util/styledMixins'
import { SelectorWrapperBase } from '@uikit/widgets/Selector/styles'
import { tryGetAddress } from '@utils'
import { transparentize } from 'polished'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

const InputWrapper = styled(SelectorWrapperBase)`
	width: 100%;
	${({ theme }) => grainyGradientMixin(theme.isDark)}
`

export const TokenSearchInput = styled.input`
	isolation: isolate;
	min-height: 32px;
	height: 32px;
	max-height: 32px;
	border-radius: 16px;
	text-align: center;

	background: none;
	display: flex;
	width: 100%;
	border: none;
	outline: none;
	color: ${({ theme }) => theme.colors.text};
	::placeholder {
		color: ${({ theme }) => transparentize(0.5, theme.colors.text)};
	}
	font-size: 12px;

	padding: 0 16px;
	white-space: nowrap;
	text-overflow: ellipsis;
	z-index: 2;
	overflow: hidden;

	:focus {
		outline: none;
	}
`

const AddressInput: React.FC<{ setError: (error: string) => void; setAddress: (address: string) => void }> = ({ setAddress, setError }) => {
	const [value, setValue] = useState('')
	const handleInput = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const input = event.target.value
			setValue(input)
			const checksummedInput = tryGetAddress(input)
			setError(checksummedInput == null ? 'Invalid address' : '')
			setAddress(checksummedInput ?? '')
		},
		[setAddress, setError]
	)
	return (
		<InputWrapper>
			<TokenSearchInput
				width='100%'
				type='text'
				id='address-input'
				placeholder='Enter Address'
				value={value}
				onChange={handleInput}
				autoComplete='off'
				spellCheck='false'
			/>
		</InputWrapper>
	)
}

export default AddressInput
