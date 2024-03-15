import { Contract } from '@ethersproject/contracts'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAggregatorStore } from '@state/aggregator/store'
import { usePendingSwapState, useTransactionAdder } from '@state/aggregator/transactions/txHooks'
import { useTokenData } from '@state/aggregator/tokens/tokenStore'
import { eN, eNbN, getSummitRouterContract } from '@utils'
import { RevertError, estimateGas } from '@utils/estimateGas'
import useActiveWeb3React from './useActiveWeb3React'
import useTransactionDeadline from './useTransactionDeadline'
import { useUniqueTxKeying } from '@components/SequentialActionsModal/useTxKeying'
import { TxStatusAndCallback } from '@state/aggregator/transactions/txTypes'
import { parseAndSetError, parseError } from './parseAndSetGasEstimationError'
import { gradientDescentFeeComparisonToAlternatives } from '@utils/gradient'
import { SwapData } from '@state/aggregator/types'
import { dbg } from '@state/aggregator/debug/debugStore'

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param deadline the deadline for the trade
 * @param recipientAddressOrName
 */
function useSwapCallArguments(permitCallData: string | null) {
	const { account, chainId, library } = useActiveWeb3React()
	const swapData = useAggregatorStore((state) => state.swapData)
	const tokenInData = useTokenData(swapData?.tokenIn)
	const tokenOutData = useTokenData(swapData?.tokenOut)
	const slippage = useAggregatorStore((state) => state.slippage)

	const recipient = account
	const deadline = useTransactionDeadline()

	return useMemo(() => {
		if (
			swapData == null || // Early exit if missing inputs
			!swapData.valid ||
			tokenInData == null ||
			tokenOutData == null ||
			!recipient ||
			!library ||
			!account ||
			!chainId ||
			!deadline
		)
			return null

		const summitRouter: Contract | null = getSummitRouterContract(library?.getSigner())
		if (!summitRouter) {
			return null
		}

		let method = 'swapNoSplit'
		if (permitCallData == null) {
			if (swapData.trade.isNativeIn) {
				method = 'swapNoSplitFromNATIVE'
			}
			if (swapData.trade.isNativeOut) {
				method = 'swapNoSplitToNATIVE'
			}
		} else {
			if (swapData.trade.isNativeIn) {
				// No permit with Native in
				return null
			}
			if (swapData.trade.isNativeOut) {
				method = 'swapNoSplitToNATIVEWithPermit'
			}
		}

		const minAfterSlippage = eNbN(swapData.tokenOutAmount, tokenOutData.decimals)
			.times(10000 - slippage)
			.div(10000)
			.toFixed(0)

		const tokenInAmountNoDec = eN(swapData.tokenInAmount, tokenInData.decimals)
		const tradeData = [
			tokenInAmountNoDec, // uint256 amountIn
			minAfterSlippage, // uint256 amountOut
			swapData.path, // address[] path
			swapData.adapters, // address[] adapters
		]

		const baseArgs = [
			tradeData, // Trade calldata trade
			account, // address to
			gradientDescentFeeComparisonToAlternatives(), // uint256 fee
		]

		return {
			contract: summitRouter,
			method,
			args: baseArgs,
			overrides: swapData.trade.isNativeIn ? { value: tokenInAmountNoDec } : {},
		}
	}, [account, chainId, deadline, library, permitCallData, recipient, slippage, swapData, tokenInData, tokenOutData])
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(permitCallData: string | null): TxStatusAndCallback {
	const swapData = useAggregatorStore((state) => state.swapData)
	const [frozenSwapData, setFrozenSwapData] = useState<SwapData | null>(null)
	const swapUniqueKey = useUniqueTxKeying()
	const tokenInData = useTokenData(swapData?.tokenIn)
	const tokenOutData = useTokenData(swapData?.tokenOut)
	const addTransaction = useTransactionAdder()
	const [swapError, setSwapError] = useState<string | null>(null)

	const resetError = useCallback(() => setSwapError(null), [setSwapError])

	// Reset swap error if the swap changes ( input / output / amount changes )
	useEffect(() => setSwapError(null), [swapUniqueKey])

	const { txStatus: pendingSwapStatus, txHash: pendingSwapHash } = usePendingSwapState(
		frozenSwapData?.tokenIn,
		frozenSwapData?.tokenInAmount,
		frozenSwapData?.tokenOut,
		frozenSwapData?.tokenOutAmount
	)

	const swapCallArguments = useSwapCallArguments(permitCallData)

	// const tupleArgs = JSON.stringify(swapCallArguments?.args).split('[').join('(').split(']').join(')').split('"').join('')

	// "[["47984831428","494727324221023",["0xd43d8adac6a4c7d9aeece7c3151fca8f23752cf8","0x4300000000000000000000000000000000000004"],["0xb7f62d059784ea5ad8e2bb0b5c3a8dd3dcce0aa7"]],"0x3a7679E3662bC7c2EB2B1E71FA221dA430c6f64B",0]"
	// "(("47984831428","494727324221023",("0xd43d8adac6a4c7d9aeece7c3151fca8f23752cf8","0x4300000000000000000000000000000000000004"),("0xb7f62d059784ea5ad8e2bb0b5c3a8dd3dcce0aa7")),"0x3a7679E3662bC7c2EB2B1E71FA221dA430c6f64B",0)"
	// "(47984831428,494727324221023,[0xd43d8adac6a4c7d9aeece7c3151fca8f23752cf8,0x4300000000000000000000000000000000000004],[0xb7f62d059784ea5ad8e2bb0b5c3a8dd3dcce0aa7])" 0x3a7679E3662bC7c2EB2B1E71FA221dA430c6f64B 0

	// console.log({
	// 	tupleArgs,
	// })

	const callback = useCallback(async (): Promise<void> => {
		dbg.log('Executing Swap', swapCallArguments)
		if (swapCallArguments == null) {
			dbg.error('Swap call arguments missing', swapCallArguments)
			return
		}
		setFrozenSwapData(swapData != null ? { ...swapData } : null)
		const innerFrozenSwapData = swapData != null ? { ...swapData } : null

		setSwapError(null)
		const gasPrice = undefined // await getGasAPI()

		const estimatedGas = await estimateGas(
			swapCallArguments.contract,
			swapCallArguments.method,
			swapCallArguments.args,
			swapCallArguments.overrides,
			1000
		).catch(parseAndSetError(setSwapError, 'swap'))

		return swapCallArguments.contract[swapCallArguments.method](...swapCallArguments.args, { gasLimit: estimatedGas, gasPrice, ...swapCallArguments.overrides })
			.then((response: any) => {
				if (innerFrozenSwapData == null) return null
				const inputAmountStr = innerFrozenSwapData?.tokenInAmount != null ? parseFloat(innerFrozenSwapData.tokenInAmount).toFixed(3) : ''
				const outputAmountStr = innerFrozenSwapData?.tokenOutAmount != null ? parseFloat(innerFrozenSwapData.tokenOutAmount).toFixed(3) : ''

				const base = `Swap ${inputAmountStr} ${tokenInData?.symbol} for ${outputAmountStr} ${tokenOutData?.symbol}`

				addTransaction(response, {
					summary: base,
					swap: {
						inputAddress: innerFrozenSwapData.tokenIn,
						exactIn: innerFrozenSwapData.tokenInAmount,
						outputAddress: innerFrozenSwapData.tokenOut,
						exactOut: innerFrozenSwapData.tokenOutAmount,
					},
				})
			})
			.catch((error: RevertError) => {
				let txErrorMsg: string | null = null
				const parsed = parseError(error)

				dbg.error('Swap call failed:', parsed, swapCallArguments)

				// if the user rejected the tx, pass this along
				if (parsed.errorCode === 'REJECTED_TRANSACTION') {
					txErrorMsg = 'Transaction Rejected.'
				} else {
					// otherwise, the error was unexpected and we need to convey that
					console.error(`Swap failed`, error)
					txErrorMsg = `Swap failed: ${parsed.context ?? parsed.errorCode.split('_').join(' ')}`
				}

				setSwapError(txErrorMsg)
				if (txErrorMsg != null) {
					console.error(txErrorMsg)
				}
			})
	}, [swapCallArguments, swapData, tokenInData?.symbol, tokenOutData?.symbol, addTransaction])

	return { txStatus: pendingSwapStatus, txHash: pendingSwapHash, txError: swapError, callback, resetError }
}

export default useSwapCallback
