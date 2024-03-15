import React from 'react'
import styled from 'styled-components'
import { Text, TextButton } from '../Text'
import Flex from '../Box/Flex'
import { AlertProps } from './types'
import { X } from 'react-feather'

const withHandlerSpacing = 32 + 12 + 8 // button size + inner spacing + handler position
const Details = styled.div<{ hasHandler: boolean }>`
	flex: 1;

	padding: 6px 12px;
	padding-right: ${({ hasHandler }) => (hasHandler ? `${withHandlerSpacing}px` : '8px')};
`

const StyledAlert = styled(Flex)`
	position: relative;
	background-color: ${({ theme }) => theme.colors.background};
	border-radius: 8px;
	box-shadow: ${({ theme }) => `0px 5px 10px ${theme.colors.text}20`};
	:hover {
		box-shadow: ${({ theme }) => `0px 10px 20px ${theme.colors.text}40`};
	}
`

const Alert: React.FC<AlertProps> = ({ title, children, onClick }) => {
	return (
		<StyledAlert>
			<Details hasHandler={!!onClick}>
				<Text bold>{title}</Text>
				{typeof children === 'string' ? <Text as='p'>{children}</Text> : children}
			</Details>
			{onClick && (
				<TextButton style={{ position: 'absolute', top: '10px', right: '10px' }} onClick={onClick}>
					<X size='16px' />
				</TextButton>
			)}
		</StyledAlert>
	)
}

export default Alert
