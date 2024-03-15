import React, { useCallback, useMemo } from 'react'
import { AllStepTypeProps, ConfirmationStepProps, StepType, TransactionStepProps, TransactionType } from './types'
import SequentialActionsModal from './SequentialActionsModal'
import { Text } from '@uikit'
import { useApproveCallback } from '@hooks/useApproveCallback'
import { useAggregatorStore, useSwapPriceImpact } from '@state/aggregator/store'
import { useTokenData } from '@state/aggregator/tokens/tokenStore'
import { useUniqueTxKeying } from './useTxKeying'
import useSwapOrWrapCallback from '@hooks/useSwapOrWrapCallback'

interface Props {
	isOpen: boolean
	onDismiss: () => void
}

const SwapFlowModal: React.FC<Props> = ({ isOpen, onDismiss }) => {
	const swapData = useAggregatorStore((state) => state.swapData)
	const tokenIn = useTokenData(swapData?.tokenIn)
	const tokenOut = useTokenData(swapData?.tokenOut)
	const swapUniqueKey = useUniqueTxKeying()
	const { priceImpact } = useSwapPriceImpact()
	const isPriceImpactSevere = priceImpact != null && parseFloat(priceImpact) > 5

	// APPROVAL
	const {
		txStatus: approvalStatus,
		txHash: approvalHash,
		txError: approvalError,
		callback: approveCallback,
		resetError: resetApprovalError,
		permitCallData,
	} = useApproveCallback(tokenIn, swapData?.tokenInAllowance, swapData?.tokenInAmount, true)

	// SWAP or WRAP
	const {
		txStatus: swapStatus,
		txHash: swapHash,
		txError: swapError,
		callback: swapCallback,
		resetError: resetSwapError,
	} = useSwapOrWrapCallback(permitCallData)

	const handleDismiss = useCallback(() => {
		onDismiss()
		resetApprovalError()
		resetSwapError()
	}, [onDismiss, resetApprovalError, resetSwapError])

	const swapOrUnwrapTitle = useMemo(() => {
		const isWrap = swapData?.trade.isWrapOrUnwrap && swapData?.trade.isNativeIn
		const isUnwrap = swapData?.trade.isWrapOrUnwrap && swapData?.trade.isNativeOut
		return isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : 'Swap'
	}, [swapData?.trade.isNativeIn, swapData?.trade.isNativeOut, swapData?.trade.isWrapOrUnwrap])

	const approveAndSwapActions = useMemo(() => {
		const confirmSellTaxStep: ConfirmationStepProps = {
			type: StepType.Confirmation,
			stepKey: 'confirm-sell-tax',
			title: `Confirm ${tokenIn?.symbol} Sell Tax`,
			toConfirm: (
				<Text warn textAlign='center'>
					The {tokenIn?.symbol} token has a <b>{((tokenIn?.tax ?? 0) / 100).toFixed(1)}% tax</b> on sell. This tax has been factored into the price and expected
					output amount.
				</Text>
			),
		}

		const confirmBuyTaxStep: ConfirmationStepProps = {
			type: StepType.Confirmation,
			stepKey: 'confirm-sell-tax',
			title: `Confirm ${tokenOut?.symbol} Buy Tax`,
			toConfirm: (
				<Text warn textAlign='center'>
					The {tokenOut?.symbol} token has a <b>{((tokenOut?.tax ?? 0) / 100).toFixed(1)}% tax</b> on buy. This tax has been factored into the price and
					expected input amount.
				</Text>
			),
		}

		// Confirm Price Impact
		const confirmImpactStep: ConfirmationStepProps = {
			type: StepType.Confirmation,
			stepKey: 'confirm',
			title: 'Confirm Price Impact',
			toConfirm: (
				<Text warn textAlign='center'>
					This trade has an extremely high price impact, which means you will lose <b>~{priceImpact}% of your token value</b>.
				</Text>
			),
		}

		// Approve Action
		const approveAction: TransactionStepProps = {
			type: StepType.Transaction,
			stepKey: 'approve',
			title: `Approve ${tokenIn?.symbol}`,
			onTransaction: approveCallback,
			txStatus: approvalStatus,
			txHash: approvalHash,
			errMsg: approvalError,
			txType: TransactionType.Approval,
		}

		// Swap Action
		const swapOrWrapAction: TransactionStepProps = {
			type: StepType.Transaction,
			stepKey: swapOrUnwrapTitle.toLowerCase(),
			title: `${swapOrUnwrapTitle} ${swapData?.tokenInAmount != null ? parseFloat(swapData?.tokenInAmount).toFixed(3) : '...'} ${tokenIn?.symbol} for ${
				swapData?.tokenOutAmount != null ? parseFloat(swapData?.tokenOutAmount).toFixed(3) : '...'
			} ${tokenOut?.symbol} `,
			onTransaction: swapCallback,
			txStatus: swapStatus,
			txHash: swapHash,
			errMsg: swapError,
			txType: TransactionType.Swap,
			completeMsg: `${swapOrUnwrapTitle} Complete`,
		}

		return [
			isPriceImpactSevere ? confirmImpactStep : null,
			tokenIn?.tax != null && tokenIn.tax > 500 ? confirmSellTaxStep : null,
			tokenOut?.tax != null && tokenOut.tax > 500 ? confirmBuyTaxStep : null,
			approveAction,
			swapOrWrapAction,
		].filter((item) => item != null) as AllStepTypeProps[]
	}, [
		tokenIn,
		tokenOut,
		priceImpact,
		approveCallback,
		approvalStatus,
		approvalHash,
		approvalError,
		swapOrUnwrapTitle,
		swapData?.tokenInAmount,
		swapData?.tokenOutAmount,
		swapCallback,
		swapStatus,
		swapHash,
		swapError,
		isPriceImpactSevere,
	])

	return (
		<SequentialActionsModal
			isOpen={isOpen}
			uniqueFlowKey={swapUniqueKey}
			title={`${swapOrUnwrapTitle} ${tokenIn?.symbol} for ${tokenOut?.symbol}`}
			steps={approveAndSwapActions}
			onDismiss={handleDismiss}
		/>
	)
}

export default SwapFlowModal
