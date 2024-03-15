import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAggregatorStore } from '@state/aggregator/store'
import { usePendingWrapState, useTransactionAdder } from '@state/aggregator/transactions/txHooks'
import { useTokenData } from '@state/aggregator/tokens/tokenStore'
import { eN, getWNativeContract } from '@utils'
import { RevertError, estimateGas } from '@utils/estimateGas'
import useActiveWeb3React from './useActiveWeb3React'
import useTransactionDeadline from './useTransactionDeadline'
import { useUniqueTxKeying } from '@components/SequentialActionsModal/useTxKeying'
import { TxStatusAndCallback } from '@state/aggregator/transactions/txTypes'
import getGasPrice from '@utils/getGasPrice'
import { parseAndSetError, parseError } from './parseAndSetGasEstimationError'
import { SwapData } from '@state/aggregator/types'
import { dbg } from '@state/aggregator/debug/debugStore'

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param deadline the deadline for the trade
 * @param recipientAddressOrName
 */
function useWrapCallArguments(permitCallData: string | null) {
	const { account, chainId, library } = useActiveWeb3React()
	const swapData = useAggregatorStore((state) => state.swapData)
	const tokenInData = useTokenData(swapData?.tokenIn)

	const recipient = account
	const deadline = useTransactionDeadline()

	return useMemo(() => {
		if (
			swapData == null || // Early exit if missing inputs
			!swapData.valid ||
			tokenInData == null ||
			!recipient ||
			!library ||
			!account ||
			!chainId ||
			!deadline
		)
			return null

		const WNATIVEContract = getWNativeContract(library?.getSigner())

		let method = 'deposit'
		// if (permitCallData == null) {
		// 	if (swapData.trade.isNativeIn) {
		// 		method = 'swapNoSplitFromNATIVE'
		// 	}
		// 	if (swapData.trade.isNativeOut) {
		// 		method = 'swapNoSplitToNATIVE'
		// 	}
		// } else {
		if (swapData.trade.isNativeIn) {
			method = 'deposit'
		}
		if (swapData.trade.isNativeOut) {
			method = 'withdraw'
		}
		// }

		const tokenInAmountNoDec = eN(swapData.tokenInAmount, tokenInData.decimals)

		return {
			contract: WNATIVEContract,
			method,
			args: swapData.trade.isNativeOut ? [tokenInAmountNoDec] : [],
			overrides: swapData.trade.isNativeIn ? { value: tokenInAmountNoDec } : {},
		}
	}, [account, chainId, deadline, library, recipient, swapData, tokenInData])
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useWrapCallback(permitCallData: string | null): TxStatusAndCallback {
	const swapData = useAggregatorStore((state) => state.swapData)
	const [frozenWrapData, setFrozenWrapData] = useState<SwapData | null>(null)
	const wrapUniqueKey = useUniqueTxKeying()
	const tokenInData = useTokenData(swapData?.tokenIn)
	const addTransaction = useTransactionAdder()
	const [wrapError, setWrapError] = useState<string | null>(null)

	const resetError = useCallback(() => setWrapError(null), [setWrapError])

	// Reset swap error if the swap changes ( input / output / amount changes )
	useEffect(() => setWrapError(null), [wrapUniqueKey])

	const { txStatus: pendingWrapStatus, txHash: pendingWrapHash } = usePendingWrapState(
		frozenWrapData?.trade.isNativeIn ? frozenWrapData?.tokenInAmount : null,
		frozenWrapData?.trade.isNativeOut ? frozenWrapData?.tokenInAmount : null
	)

	const wrapCallArguments = useWrapCallArguments(permitCallData)

	const callback = useCallback(async (): Promise<void> => {
		dbg.log('Executing Wrap', wrapCallArguments)
		if (wrapCallArguments == null) {
			dbg.error('Wrap call arguments missing')
			return
		}
		setFrozenWrapData(swapData != null ? { ...swapData } : null)
		const innerFrozenWrapData = swapData != null ? { ...swapData } : null

		setWrapError(null)
		const gasPrice = await getGasPrice()

		const estimatedGas = await estimateGas(
			wrapCallArguments.contract,
			wrapCallArguments.method,
			wrapCallArguments.args,
			wrapCallArguments.overrides,
			1000
		).catch(parseAndSetError(setWrapError, 'Wrap'))

		if (estimateGas == null) {
			return
		}

		return wrapCallArguments.contract[wrapCallArguments.method](...wrapCallArguments.args, { gasLimit: estimatedGas, gasPrice, ...wrapCallArguments.overrides })
			.then((response: any) => {
				if (innerFrozenWrapData == null) return null
				const inputAmountStr = innerFrozenWrapData?.tokenInAmount != null ? parseFloat(innerFrozenWrapData.tokenInAmount).toFixed(3) : ''
				const wrapOrUnwrap = innerFrozenWrapData?.trade.isNativeIn ? 'Wrap' : 'Unwrap'
				const base = `${wrapOrUnwrap} ${inputAmountStr} ${tokenInData?.symbol}`

				addTransaction(response, {
					summary: base,
					wrap: {
						wrapAmount: innerFrozenWrapData.trade.isNativeIn ? innerFrozenWrapData.tokenInAmount : null,
						unwrapAmount: innerFrozenWrapData.trade.isNativeOut ? innerFrozenWrapData.tokenInAmount : null,
					},
				})
			})
			.catch((error: RevertError) => {
				let txErrorMsg: string | null = null
				const parsed = parseError(error)
				const wrapOrUnwrap = innerFrozenWrapData?.trade.isNativeIn ? 'Wrap' : 'Unwrap'
				dbg.error(`${wrapOrUnwrap} call failed:`, parsed, wrapCallArguments)

				// if the user rejected the tx, pass this along
				if (parsed.errorCode === 'REJECTED_TRANSACTION') {
					txErrorMsg = 'Transaction Rejected.'
				} else {
					// otherwise, the error was unexpected and we need to convey that
					console.error(`${wrapOrUnwrap} failed`, error)
					txErrorMsg = `${wrapOrUnwrap} failed: ${parsed.context ?? parsed.errorCode.split('_').join(' ')}`
				}

				setWrapError(txErrorMsg)
				if (txErrorMsg != null) {
					console.error(txErrorMsg)
				}
			})
	}, [wrapCallArguments, swapData, tokenInData?.symbol, addTransaction])

	return { txStatus: pendingWrapStatus, txHash: pendingWrapHash, txError: wrapError, callback, resetError }
}

export default useWrapCallback
