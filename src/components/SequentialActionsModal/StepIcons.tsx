import styled from 'styled-components'
import { IntActionState } from './types'
import { CheckCircle, Circle, Clock, XCircle } from 'react-feather'

const StyledCircleEmptyIcon = styled(Circle)`
	stroke: ${({ theme }) => theme.colors.text};
	width: 16px;
	height: 16px;
`
const StyledCircleSolidIcon = styled(Circle)`
	stroke: ${({ theme }) => theme.colors.text};
	filter: drop-shadow(0px 0px 6px ${({ theme }) => theme.colors.text}50) drop-shadow(0px 0px 12px ${({ theme }) => theme.colors.text}30);
	width: 16px;
	height: 16px;
`
const StyledCircleTimeIcon = styled(Clock)`
	stroke: ${({ theme }) => theme.colors.warning};
	width: 16px;
	height: 16px;
`
const StyledCircleCheckIcon = styled(CheckCircle)`
	stroke: ${({ theme }) => theme.colors.text};
	width: 16px;
	height: 16px;
`
const StyledCircleRemoveIcon = styled(XCircle)`
	stroke: ${({ theme }) => theme.colors.failure};
	width: 16px;
	height: 16px;
`

const StepIcons = {
	[IntActionState.InQueue]: <StyledCircleEmptyIcon />,
	[IntActionState.WaitingForAction]: <StyledCircleSolidIcon />,
	[IntActionState.Pending]: <StyledCircleTimeIcon />,
	[IntActionState.Complete]: <StyledCircleCheckIcon />,
	[IntActionState.Error]: <StyledCircleRemoveIcon />,
}

export default StepIcons
