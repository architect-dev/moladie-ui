import React, { ReactNode } from 'react'
import { StepInteractionTextContainer, StepInteractionText } from './styles'
import { RowCenter } from '@uikit'

interface Props {
	text: ReactNode
	buttons?: JSX.Element[]
}

const InteractionScaffold: React.FC<Props> = ({ text, buttons }) => {
	return (
		<>
			<StepInteractionTextContainer>
				<StepInteractionText>{text}</StepInteractionText>
			</StepInteractionTextContainer>
			{buttons != null && <RowCenter gap='24px'>{buttons}</RowCenter>}
		</>
	)
}

export default InteractionScaffold
