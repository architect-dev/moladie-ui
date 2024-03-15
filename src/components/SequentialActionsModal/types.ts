import { TxStatus } from '@state/aggregator/transactions/txTypes'
import { Nullable } from '@utils'
import { ReactNode } from 'react'

export enum IntActionState {
	InQueue = 'InQueue',
	WaitingForAction = 'WaitingForAction',
	Pending = 'Pending',
	Complete = 'Complete',
	Error = 'Error',
}

export enum StepType {
	Transaction,
	Confirmation,
}

export enum TransactionType {
	Approval,
	Swap,
	Limit,
}

interface BaseStepProps {
	type: StepType
	title: string
	stepKey: string
}

export interface TransactionStepProps extends BaseStepProps {
	type: StepType.Transaction
	onTransaction: (() => void) | (() => Promise<void>) | null
	txStatus: TxStatus
	txHash: Nullable<string>
	errMsg: Nullable<string>
	txType: TransactionType
	completeMsg?: ReactNode
}
export interface ConfirmationStepProps extends BaseStepProps {
	type: StepType.Confirmation
	toConfirm: JSX.Element
}

export type AllStepTypeProps = TransactionStepProps | ConfirmationStepProps
