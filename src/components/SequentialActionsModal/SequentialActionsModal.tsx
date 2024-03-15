import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AllStepTypeProps, StepType } from './types'
import { TransactionStepInteraction, TransactionStepRow } from './TransactionStep'
import { ConfirmationStepRow, ConfirmationStepInteraction } from './ConfirmationStep'
import { StepInteractionContainer, StepsContainer } from './styles'
import { useTransactionAcknowledger } from '@state/aggregator/transactions/txHooks'
import { TxStatus } from '@state/aggregator/transactions/txTypes'
import { ModalContentContainer, SummitPopUp } from '@uikit'

export interface Props {
	isOpen: boolean
	uniqueFlowKey: string
	title: string
	steps: AllStepTypeProps[]
	onDismiss?: () => void
}

const SequentialActionsModal: React.FC<Props> = ({ isOpen, uniqueFlowKey, title, steps, onDismiss }) => {
	const acknowledgeTx = useTransactionAcknowledger()
	const [confirmedSteps, setConfirmedSteps] = useState<Record<string, boolean>>({})
	const [firedSteps, setFiredSteps] = useState<Record<string, boolean>>({})

	// Reset confirmed steps when the unique flow changes
	useEffect(() => {
		setConfirmedSteps({})
	}, [uniqueFlowKey, setConfirmedSteps])

	// Reset fired steps whenever the modal closes
	useEffect(() => {
		if (!isOpen) {
			setFiredSteps({})
		}
	}, [isOpen, setFiredSteps])

	const markStepConfirmed = useCallback(
		(stepTitle: string) => setConfirmedSteps((prev) => ({ ...prev, [`${uniqueFlowKey}_${stepTitle}`]: true })),
		[uniqueFlowKey, setConfirmedSteps]
	)
	const markStepFired = useCallback(
		(stepTitle: string) => setFiredSteps((prev) => ({ ...prev, [`${uniqueFlowKey}_${stepTitle}`]: true })),
		[uniqueFlowKey, setFiredSteps]
	)

	const [activeStepIndex, activeStep, allStepsCompleted] = useMemo(() => {
		if (!isOpen) return [-2, null, false]

		const finalStep = steps[steps.length - 1]
		const finalStepComplete = finalStep.type === StepType.Transaction && finalStep.txStatus === TxStatus.Finalized
		if (finalStepComplete) return [steps.length - 1, finalStep, true]

		const incompleteSteps = steps
			// Map each step to its index if its incomplete, else null
			.map((step, stepIndex) => {
				switch (step.type) {
					case StepType.Transaction:
						return step.txStatus !== TxStatus.Finalized ? stepIndex : null
					case StepType.Confirmation:
						return !confirmedSteps[`${uniqueFlowKey}_${step.title}`] ? stepIndex : null
					default:
						return null
				}
			})
			// Filter for non-null steps
			.filter((stepIndex) => stepIndex != null) as number[]

		const i = incompleteSteps[0]
		const step = steps[incompleteSteps.length === 0 ? steps.length - 1 : i]
		return [i, step, incompleteSteps.length === 0]
	}, [uniqueFlowKey, isOpen, steps, confirmedSteps])

	useEffect(() => {
		if (activeStep == null) return
		if (activeStep.type !== StepType.Transaction) return
		if (firedSteps[`${uniqueFlowKey}_${activeStep.stepKey}`]) return

		// Wait while tx state is unknown (prevent early firing of already complete but unloaded step)
		if (activeStep.txStatus === TxStatus.Unknown) return

		// Mark as fired if the step is already pending
		if (activeStep.txStatus === TxStatus.Pending || activeStep.txStatus === TxStatus.Finalized) {
			markStepFired(activeStep.stepKey)
			return
		}

		markStepFired(activeStep.stepKey)
		setTimeout(() => {
			activeStep?.onTransaction?.()
		}, 500)
	}, [uniqueFlowKey, activeStep, firedSteps, markStepFired])

	// Acknowledge the transaction on dismiss if everything has finalized
	// const finalStep = useMemo(() => steps[steps.length - 1], [steps])
	const handleDismiss = useCallback(() => {
		onDismiss?.()
		if (allStepsCompleted) {
			steps.forEach((step) => {
				if (step.type === StepType.Transaction && step.txHash != null) {
					acknowledgeTx(step.txHash)
				}
			})
		}
	}, [onDismiss, allStepsCompleted, steps, acknowledgeTx])

	// When final transaction succeeds, persist set
	// const setTxs = useMemo(
	// 	() => steps.map((step) => (step.type === StepType.Transaction ? { hash: step.txHash, text: step.title } : null)).filter((stepTx) => stepTx != null),
	// 	[steps]
	// )
	// useEffect(() => {
	// 	if (!allStepsCompleted) return
	// 	if (finalStep.type !== StepType.Transaction) return
	// }, [txSetAdded, allStepsCompleted, setTxs, stepListTitle, setTxSetAdded, finalStep])

	return (
		<SummitPopUp
			open={isOpen}
			callOnDismiss={handleDismiss}
			modal
			popUpTitle={title}
			popUpContent={
				<ModalContentContainer alignItems='flex-start' gap='12px'>
					<br />
					<StepsContainer>
						{steps.map((step, index) => {
							switch (step.type) {
								case StepType.Transaction:
									return <TransactionStepRow key={step.title} step={step} index={index} activeIndex={activeStepIndex} />
								case StepType.Confirmation:
									return (
										<ConfirmationStepRow
											key={step.title}
											step={step}
											index={index}
											activeIndex={activeStepIndex}
											confirmed={!!confirmedSteps[`${uniqueFlowKey}_${step.title}`]}
										/>
									)
								default:
									return null
							}
						})}
					</StepsContainer>
					<StepInteractionContainer>
						{activeStep != null && activeStep.type === StepType.Transaction && (
							<TransactionStepInteraction step={activeStep} index={activeStepIndex} activeIndex={activeStepIndex} onDismiss={handleDismiss} />
						)}
						{activeStep != null && activeStep.type === StepType.Confirmation && (
							<ConfirmationStepInteraction step={activeStep} markStepConfirmed={markStepConfirmed} onDismiss={handleDismiss} />
						)}
					</StepInteractionContainer>
				</ModalContentContainer>
			}
		/>
	)
}

export default SequentialActionsModal
