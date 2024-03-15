import React from 'react'
import { IntActionState, TransactionStepProps } from './types'
import StepIcons from './StepIcons'
import { SequentialItemWrapper, ItemTitleText, ItemSecondRow, SecondRowText, PendingText } from './styles'
import InteractionScaffold from './InteractionScaffold'
import { TxStatus } from '@state/aggregator/transactions/txTypes'
import { ExternalLinkButton, RowStart, SummitButton } from '@uikit'
import { getXScanLink } from '@config/constants'
import { Dots } from '@uikit/components/Dots'
import { Nullable } from '@utils'

const getInternalActionState = (txStatus: TxStatus, errMsg: Nullable<string>, index: number, activeIndex: number): IntActionState => {
	if (errMsg != null) return IntActionState.Error
	if (activeIndex > index || txStatus === TxStatus.Finalized) return IntActionState.Complete
	if (index === activeIndex && (txStatus === TxStatus.Incomplete || txStatus === TxStatus.WaitingForWallet)) return IntActionState.WaitingForAction
	if (index === activeIndex && txStatus === TxStatus.Pending) return IntActionState.Pending
	return IntActionState.InQueue
}

const getStepRowSubtext = (state: IntActionState, errMsg: Nullable<string>): JSX.Element | string | null => {
	switch (state) {
		case IntActionState.Error:
			return errMsg ?? 'Unknown Error'
		case IntActionState.WaitingForAction:
			return 'Action needed in wallet'
		case IntActionState.Pending:
			return (
				<PendingText>
					Pending
					<Dots />
				</PendingText>
			)
		case IntActionState.InQueue:
		case IntActionState.Complete:
		default:
			return null
	}
}

export const TransactionStepRow: React.FC<{
	step: TransactionStepProps
	index: number
	activeIndex: number
}> = ({ step, index, activeIndex }) => {
	const { title, txStatus, txHash, errMsg } = step
	const txHashEllipsis = txHash ? `${txHash.substring(0, 4)}...${txHash.substring(txHash.length - 4)}` : null
	const state = getInternalActionState(txStatus, errMsg, index, activeIndex)
	const subText = getStepRowSubtext(state, errMsg)
	return (
		<SequentialItemWrapper collapsible expanded={errMsg != null}>
			<RowStart gap='8px'>
				{StepIcons[state]}
				<ItemTitleText bold={index >= activeIndex} err={errMsg != null}>
					{errMsg != null ? 'Failed: ' : ''}
					{title}
				</ItemTitleText>
			</RowStart>
			<ItemSecondRow className='item-second-row' state={state}>
				{subText != null && <SecondRowText>{subText}</SecondRowText>}

				{txHash != null && (txStatus === TxStatus.Pending || txStatus === TxStatus.Finalized) && (
					<ExternalLinkButton fontSize='14px' external href={getXScanLink(txHash, 'transaction')}>
						Transaction: {txHashEllipsis}
					</ExternalLinkButton>
				)}
			</ItemSecondRow>
		</SequentialItemWrapper>
	)
}

export const TransactionStepInteraction: React.FC<{
	step: TransactionStepProps
	index: number
	activeIndex: number
	onDismiss: () => void
}> = ({ step, index, activeIndex, onDismiss }) => {
	const { txStatus: txState, errMsg, title, completeMsg } = step
	const state = getInternalActionState(txState, errMsg, index, activeIndex)

	const key = `${title}_${state}`

	if (state === IntActionState.WaitingForAction) {
		return <InteractionScaffold key={key} text='Waiting for confirmation from your wallet...' />
	}

	if (state === IntActionState.Pending) {
		return <InteractionScaffold key={key} text='Transaction submitted! You may close this window while it is being processed.' />
	}

	if (state === IntActionState.Error) {
		return (
			<InteractionScaffold
				key={key}
				text={errMsg}
				buttons={[
					<SummitButton key='close' variant='secondary' width='180px' onClick={onDismiss}>
						Close
					</SummitButton>,
					<SummitButton key='retry' variant='primary' width='180px' onClick={() => step?.onTransaction?.()}>
						Try Again
					</SummitButton>,
				]}
			/>
		)
	}

	if (state === IntActionState.Complete) {
		return (
			<InteractionScaffold
				key={key}
				text={completeMsg}
				buttons={[
					<SummitButton key='done' variant='secondary' width='180px' onClick={onDismiss}>
						Done
					</SummitButton>,
				]}
			/>
		)
	}

	return null
}
