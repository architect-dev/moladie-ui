import React from 'react'
import { ConfirmationStepProps, IntActionState } from './types'
import StepIcons from './StepIcons'
import { SequentialItemWrapper, ItemTitleText, ItemSecondRow, SecondRowText } from './styles'
import InteractionScaffold from './InteractionScaffold'
import { RowStart, SummitButton } from '@uikit'

export const ConfirmationStepRow: React.FC<{
	step: ConfirmationStepProps
	index: number
	activeIndex: number
	confirmed: boolean
}> = ({ step, activeIndex, index, confirmed }) => {
	const { title } = step
	const state = confirmed ? IntActionState.Complete : activeIndex === index ? IntActionState.WaitingForAction : IntActionState.InQueue
	return (
		<SequentialItemWrapper collapsible expanded={activeIndex === index}>
			<RowStart gap='8px'>
				{StepIcons[state]}
				<ItemTitleText bold={index >= activeIndex} err={false}>
					{title}
				</ItemTitleText>
			</RowStart>
			<ItemSecondRow className='item-second-row' state={state}>
				{state === IntActionState.WaitingForAction && <SecondRowText>Needs confirmation below</SecondRowText>}
				{state === IntActionState.Complete && <SecondRowText>Confirmed</SecondRowText>}
			</ItemSecondRow>
		</SequentialItemWrapper>
	)
}

export const ConfirmationStepInteraction: React.FC<{
	step: ConfirmationStepProps
	markStepConfirmed: (title: string) => void
	onDismiss: () => void
}> = ({ step, markStepConfirmed, onDismiss }) => {
	return (
		<InteractionScaffold
			key='confirmationInteraction'
			text={step.toConfirm}
			buttons={[
				<SummitButton key='confirm' variant='danger' width='180px' onClick={() => markStepConfirmed(step.title)}>
					Confirm
				</SummitButton>,
				<SummitButton key='cancel' variant='primary' width='180px' onClick={onDismiss}>
					Cancel
				</SummitButton>,
			]}
		/>
	)
}
