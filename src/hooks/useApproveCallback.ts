import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { splitSignature } from '@ethersproject/bytes'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { usePermitERC20, useSummitRouter } from './useContract'
import useActiveWeb3React from './useActiveWeb3React'
import { useAggregatorStore } from '@state/aggregator/store'
import useTransactionDeadline from './useTransactionDeadline'
import { TxStatus, TxStatusAndCallback } from '@state/aggregator/transactions/txTypes'
import { Token } from '@state/aggregator/types'
import { Nullable, bn, calculateGasMargin, eN } from '@utils'
import { zeroAdd } from '@config/constants'
import { getPermitEIP712Domain, getTokenDomainData } from '@utils/permit'
import { useSingleCallResult } from '@state/aggregator/calls/callsHooks'
import getCallData from '@utils/callData'
import { usePendingApprovalState, useTransactionAdder } from '@state/aggregator/transactions/txHooks'
import getGasPrice from '@utils/getGasPrice'
import { parseAndSetError, parseError } from './parseAndSetGasEstimationError'
import { RevertError } from '@utils/estimateGas'
import { SummitRouter } from '@config/deployments'

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
	token: Nullable<Token>,
	tokenInAllowance?: string,
	tokenInAmount?: string,
	usePermit?: boolean
): TxStatusAndCallback & { permitCallData: string | null } {
	const { account, library } = useActiveWeb3React()
	const spender = SummitRouter.address
	const infApprovals = useAggregatorStore((state) => state.infApprovals)
	const infPermits = useAggregatorStore((state) => state.infPermits)
	const deadlineFromNow = useTransactionDeadline()
	const currentAllowance = token != null && tokenInAllowance != null ? eN(tokenInAllowance, token.decimals) : null
	const amountToApprove = token != null && tokenInAmount != null ? eN(tokenInAmount, token.decimals) : null

	const summitRouter = useSummitRouter()
	const { txStatus: pendingApprovalStatus, txHash: pendingApprovalHash } = usePendingApprovalState(
		token?.address,
		spender,
		infApprovals ? MaxUint256.toString() : amountToApprove
	)
	const [permitCallData, setPermitCallData] = useState<string | null>(null)
	const [approvalError, setApprovalError] = useState<string | null>(null)

	const resetError = useCallback(() => setApprovalError(null), [setApprovalError])

	// Reset approval error if amount to approve / spender changes
	const resetPersistor = `${token?.address?.toLowerCase()}_${amountToApprove}_${spender?.toLowerCase()}`
	useEffect(() => {
		setApprovalError(null)
		setPermitCallData(null)
	}, [resetPersistor])

	// check the current approval status
	const txStatus: TxStatus = useMemo(() => {
		if (!amountToApprove || !spender) return TxStatus.Unknown
		if (token?.address === zeroAdd) return TxStatus.Finalized

		// If permit signature is non-null, indicates permit is allowed and complete
		if (permitCallData != null) return TxStatus.Finalized

		// we might not have enough data to know whether or not we need to approve
		if (!currentAllowance) return TxStatus.Unknown

		if (bn(currentAllowance).gte(amountToApprove)) return TxStatus.Finalized

		return pendingApprovalStatus
	}, [amountToApprove, currentAllowance, pendingApprovalStatus, permitCallData, spender, token?.address])

	const tokenContract = usePermitERC20(token?.address)
	const tokenName = useSingleCallResult(tokenContract, 'name')
	const tokenSymbol = useSingleCallResult(tokenContract, 'symbol')
	const addTransaction = useTransactionAdder()

	const fallbackApproval = useCallback(async (): Promise<string | undefined> => {
		let errorMsg: string | null = null

		if (txStatus !== TxStatus.Incomplete) {
			errorMsg = 'approve was called unnecessarily'
		}

		if (!token) {
			errorMsg = 'no token'
		}

		if (!tokenContract) {
			errorMsg = 'tokenContract is null'
		}

		if (!amountToApprove) {
			errorMsg = 'missing amount to approve'
		}

		if (!spender) {
			errorMsg = 'no spender'
		}

		if (!library) {
			errorMsg = 'no connection'
		}

		if (!summitRouter) {
			errorMsg = 'no summit router'
		}

		// Sets to error or null
		setApprovalError(errorMsg)

		// Early exit if non-null error
		if (errorMsg != null) {
			console.error(errorMsg)
			return
		}

		// Validations are handled by permitApproval, not necessary in fallback

		const approveAmount = infApprovals ? MaxUint256.toString() : amountToApprove

		const gasPrice = await getGasPrice()
		const estimatedGas = await tokenContract!.estimateGas
			.approve(spender, approveAmount)
			.catch(() => {
				// fallback to exact amount for tokens who restrict approval amount
				return tokenContract!.estimateGas.approve(spender, approveAmount)
			})
			.catch(parseAndSetError(setApprovalError))

		if (estimatedGas == null) {
			return
		}

		// eslint-disable-next-line consistent-return
		return tokenContract!
			.approve(spender, approveAmount, {
				gasLimit: calculateGasMargin(estimatedGas.toString()).toJSON(),
				gasPrice,
			})
			.then((response: TransactionResponse) => {
				addTransaction(response, {
					summary: `Approve ${token?.symbol}`,
					approval: { tokenAddress: token!.address, spender: spender!, amount: approveAmount! },
				})
				setApprovalError(null)
				return response.hash
			})
			.catch((error: RevertError) => {
				let txErrorMsg: string | null = null
				const parsed = parseError(error)
				// if the user rejected the tx, pass this along
				if (parsed.errorCode === 'REJECTED_TRANSACTION') {
					txErrorMsg = 'Transaction Rejected.'
				} else {
					// otherwise, the error was unexpected and we need to convey that
					txErrorMsg = `Approval failed: ${parsed.context ?? parsed.errorCode.split('_').join(' ')}`
				}
				setApprovalError(txErrorMsg)
				if (txErrorMsg != null) {
					console.error(txErrorMsg)
				}
			})
	}, [txStatus, token, tokenContract, amountToApprove, spender, library, summitRouter, infApprovals, addTransaction])

	const approve = useCallback(async () => {
		let errorMsg: string | null = null

		if (txStatus !== TxStatus.Incomplete) {
			errorMsg = 'approve was called unnecessarily'
		}

		if (!token) {
			errorMsg = 'no token'
		}

		if (!tokenContract) {
			errorMsg = 'tokenContract is null'
		}

		if (!amountToApprove) {
			errorMsg = 'missing amount to approve'
		}

		if (!deadlineFromNow) {
			errorMsg = 'block still loading'
		}

		if (!spender) {
			errorMsg = 'no spender'
		}

		if (!library) {
			errorMsg = 'no connection'
		}

		if (!summitRouter) {
			errorMsg = 'no summit router'
		}

		// Sets to error or null
		setApprovalError(errorMsg)

		// Early exit if non-null error
		if (errorMsg != null) {
			console.error(errorMsg)
			return
		}

		// Standard approve and exit if:
		//  Couldn't find token info
		//  Connection doesn't support signing
		//  Spender doesn't handle selfPermit
		if (
			!usePermit ||
			token?.permit == null ||
			token?.permit === 0
			/* library?.provider?.isWalletConnect || */
		) {
			await fallbackApproval()
			return
		}

		// try to gather a signature for permission
		const nonce = await tokenContract!.nonces(account)

		const EIP712Domain = getPermitEIP712Domain(token.permit)
		const domain = getTokenDomainData(token, tokenName.result?.[0], tokenSymbol.result?.[0])

		const permitAmount = infPermits ? MaxUint256.toString() : amountToApprove

		const Permit = [
			{ name: 'owner', type: 'address' },
			{ name: 'spender', type: 'address' },
			{ name: 'value', type: 'uint256' },
			{ name: 'nonce', type: 'uint256' },
			{ name: 'deadline', type: 'uint256' },
		]
		const message = {
			owner: account,
			spender,
			value: permitAmount,
			nonce: nonce.toHexString(),
			deadline: deadlineFromNow!.toNumber(),
		}
		const data = JSON.stringify({
			types: {
				EIP712Domain,
				Permit,
			},
			domain,
			primaryType: 'Permit',
			message,
		})

		library!
			.send('eth_signTypedData_v4', [account, data])
			.then(splitSignature)
			.then((signature) => {
				setPermitCallData(
					getCallData(summitRouter, 'selfPermit', [tokenContract!.address, permitAmount, deadlineFromNow!.toNumber(), signature.v, signature.r, signature.s])
				)
			})
			.catch(async (error) => {
				if (error?.code === 4001) {
					const txErrorMsg = 'Transaction Rejected.'
					setApprovalError(txErrorMsg)
					console.error(txErrorMsg)
				} else {
					const txErrorMsg = `Permit failed: ${error.message}`
					console.error(txErrorMsg)
					console.error('Falling Back to Standard Approval')
					await fallbackApproval()
				}
			})
	}, [
		txStatus,
		token,
		tokenContract,
		amountToApprove,
		deadlineFromNow,
		spender,
		library,
		summitRouter,
		usePermit,
		account,
		tokenName.result,
		tokenSymbol.result,
		infPermits,
		fallbackApproval,
	])

	return { txStatus, txHash: pendingApprovalHash, txError: approvalError, callback: approve, resetError, permitCallData }
}
