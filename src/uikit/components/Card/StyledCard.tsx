import styled, { DefaultTheme } from 'styled-components'
import { space } from 'styled-system'
import { CardProps } from './types'

interface StyledCardProps extends CardProps {
	theme: DefaultTheme
}

/**
 * Priority: Warning --> Success --> Active
 */
const getBoxShadow = ({ isActive, isSuccess, isWarning, theme }: StyledCardProps) => {
	if (isWarning) {
		return theme.card.boxShadowWarning
	}

	if (isSuccess) {
		return theme.card.boxShadowSuccess
	}

	if (isActive) {
		return theme.card.boxShadowActive
	}

	return theme.card.boxShadow
}

const StyledCard = styled.div<StyledCardProps>`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: ${({ theme }) => theme.colors.background};
	border: ${({ theme }) => theme.card.boxShadow};
	border-radius: 8px;
	box-shadow: ${({ theme }) => `0px 5px 10px ${theme.colors.text}20`};
	color: ${({ theme, isDisabled }) => theme.colors[isDisabled ? 'textDisabled' : 'text']};
	overflow: hidden;
	position: relative;
	padding: 24px 14px;
	gap: 24px;
	width: 400px;
	max-width: calc(100vw - 12px);

	${space}
`

StyledCard.defaultProps = {
	isActive: false,
	isSuccess: false,
	isWarning: false,
	isDisabled: false,
}

export default StyledCard
