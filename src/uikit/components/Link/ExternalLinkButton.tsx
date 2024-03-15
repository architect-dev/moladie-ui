import React from 'react'
import styled from 'styled-components'
import Link from './Link'
import { LinkProps } from './types'
import { pressableMixin } from '@uikit/util/styledMixins'
import { ExternalLink } from 'react-feather'
import { getColor } from '../Text'

const StyleButton = styled(Link)`
	position: relative;
	display: flex;
	align-items: center;
	font-size: 13px;
	gap: 6px;
	text-align: right;
	white-space: nowrap;
	font-weight: 400;

	cursor: pointer;
	line-height: 24px;
	padding: 0px 8px;
	margin: 0px -8px;
	color: ${getColor};
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;

	${pressableMixin}

	&:hover {
		font-weight: bold;
		text-decoration: underline;
		> * {
			stroke: ${({ theme }) => theme.colors.text};
			stroke-width: ${({ hoverStrokeWidth = 3 }) => hoverStrokeWidth};
		}
	}
`

const ExternalLinkButton: React.FC<LinkProps & { noIcon?: boolean }> = ({ children, noIcon = false, ...props }) => {
	return (
		<StyleButton external rel='noreferrer noopener' target='_blank' {...props}>
			{children}
			{!noIcon && <ExternalLink size='14px' />}
		</StyleButton>
	)
}

export default ExternalLinkButton
