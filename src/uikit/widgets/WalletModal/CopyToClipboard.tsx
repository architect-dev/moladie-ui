import React, { useState } from 'react'
import styled from 'styled-components'
import { Text } from '../../components/Text/Text'
import { pressableMixin } from '@uikit/util/styledMixins'
import { Copy } from 'react-feather'
import { TextProps } from '@uikit'
import CopiedIndicator from '@components/CopiedIndicator'

interface Props extends TextProps {
	toCopy: string
	includeIcon?: boolean
	children?: React.ReactNode
}

const StyleButton = styled(Text).attrs({ role: 'button' })`
	position: relative;
	display: flex;
	gap: 6px;
	align-items: center;
	justify-content: flex-end;

	${pressableMixin}

	&:hover {
		font-weight: bold;
		text-decoration: underline;
		> * {
			stroke-width: 3;
		}
	}
`

const CopyToClipboardButton: React.FC<Props> = ({ toCopy, children, includeIcon = true, ...props }) => {
	const [copyCount, setCopyCount] = useState(0)
	return (
		<StyleButton
			small
			bold
			onClick={() => {
				setCopyCount((count) => count + 1)
				if (navigator.clipboard) {
					navigator.clipboard.writeText(toCopy)
				}
			}}
			{...props}
		>
			{children}
			{includeIcon && <Copy size='14px' />}
			{copyCount > 0 && <CopiedIndicator key={`${copyCount}`} />}
		</StyleButton>
	)
}

export default CopyToClipboardButton
