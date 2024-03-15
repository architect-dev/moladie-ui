import { Contract } from '@ethersproject/contracts'
import { useCallback, useEffect, useState } from 'react'
import { usePendingSetReferralCodeState, useTransactionAdder } from '@state/aggregator/transactions/txHooks'
import { getSummitReferralsContract } from '@utils'
import { RevertError, estimateGas } from '@utils/estimateGas'
import useActiveWeb3React from './useActiveWeb3React'
import { TxStatusAndCallback } from '@state/aggregator/transactions/txTypes'
import getGasPrice from '@utils/getGasPrice'
import { parseAndSetError, parseError } from './parseAndSetGasEstimationError'

export function useSetReferralCodeCallback(code: string): TxStatusAndCallback {
	const { library } = useActiveWeb3React()
	const uniqueKey = `set_referral_code_${code}`
	const addTransaction = useTransactionAdder()
	const [codeError, setCodeError] = useState<string | null>(null)
	const summitReferrals: Contract | null = getSummitReferralsContract(library?.getSigner())

	const resetError = useCallback(() => setCodeError(null), [setCodeError])

	// Reset error if code changes
	useEffect(() => setCodeError(null), [uniqueKey])

	const { txStatus: pendingSetReferralCodeStatus, txHash: pendingSetReferralCodeHash } = usePendingSetReferralCodeState(code)

	const callback = useCallback(async (): Promise<void> => {
		setCodeError(null)
		const gasPrice = await getGasPrice()

		const estimatedGas = await estimateGas(summitReferrals, 'setReferralCode', [code], {}, 1000).catch(parseAndSetError(setCodeError))

		if (estimateGas == null) {
			return
		}

		return summitReferrals
			.setReferralCode(code, { gasLimit: estimatedGas, gasPrice })
			.then((response: any) => {
				const base = `Set Referral Code <${code}>`

				addTransaction(response, {
					summary: base,
					setReferralCode: { code },
				})
			})
			.catch((error: RevertError) => {
				let txErrorMsg: string | null = null
				const parsed = parseError(error)
				// if the user rejected the tx, pass this along
				if (parsed.errorCode === 'REJECTED_TRANSACTION') {
					txErrorMsg = 'Transaction Rejected.'
				} else {
					// otherwise, the error was unexpected and we need to convey that
					console.error(`Tx failed`, error)
					txErrorMsg = `Tx failed: ${parsed.context ?? parsed.errorCode.split('_').join(' ')}`
				}

				setCodeError(txErrorMsg)
				if (txErrorMsg != null) {
					console.error(txErrorMsg)
				}
			})
	}, [summitReferrals, code, addTransaction])

	return { txStatus: pendingSetReferralCodeStatus, txHash: pendingSetReferralCodeHash, txError: codeError, callback, resetError }
}

export default useSetReferralCodeCallback
