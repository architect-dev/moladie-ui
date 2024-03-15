import { TransactionResponse } from '@ethersproject/providers'
import { useCallback, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { AddTransactionCustomData, TransactionDetails, TxStatus, TxStatusAndHash } from './txTypes'
import { useTxStore } from './txStore'
import { Nullable } from '@utils'

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (response: TransactionResponse, customData?: AddTransactionCustomData) => void {
	const { chainId, account } = useWeb3React()
	const addTransaction = useTxStore((state) => state.addTransaction)

	return useCallback(
		(response: TransactionResponse, { summary, approval, swap, wrap, setReferralCode, setReferrer }: AddTransactionCustomData = {}) => {
			if (!account) return
			if (!chainId) return

			const { hash } = response
			if (!hash) {
				throw Error('No transaction hash found.')
			}
			addTransaction({
				hash,
				from: account,
				chainId,
				approval,
				swap,
				wrap,
				setReferralCode,
				setReferrer,
				summary,
			})
		},
		[addTransaction, chainId, account]
	)
}

export function useTransactionAcknowledger(): (hash: string) => void {
	const { chainId } = useWeb3React()
	const acknowledgeTransaction = useTxStore((state) => state.acknowledgeTransaction)
	return useCallback(
		(hash: string) => {
			if (!chainId) return
			if (!hash) return
			acknowledgeTransaction({ chainId, hash })
		},
		[acknowledgeTransaction, chainId]
	)
}

// export function useTransactionSetAdder(): (hash: string, title: string, txs: TransactionSetItem[]) => void {
//   const { chainId } = useWeb3React()
//   const addTransactionSet = useTxStore((state) => state.addTransactionSet)
//   return useCallback(
//     ( hash: string, title: string, txs: TransactionSetItem[] ) => {
//       if (!chainId) return
//       if (!hash || !title || !txs) return
//       addTransactionSet({ chainId, hash, title, txs })
//     },
//     [addTransactionSet, chainId],
//   )
// }

// returns all the transactions for the current chain
export function useAllTransactions(): { [txHash: string]: TransactionDetails } {
	const { chainId } = useWeb3React()
	return useTxStore((state) => (chainId ? state.txs[chainId] ?? {} : {}))
}

export function useIsTransactionPending(transactionHash?: string): boolean {
	const transactions = useAllTransactions()

	if (!transactionHash || !transactions[transactionHash]) return false

	return !transactions[transactionHash].receipt
}

/**
 * Returns whether a transaction happened in the last week (7 * 86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionThisWeek(tx: TransactionDetails): boolean {
	return new Date().getTime() - tx.addedTime < 7 * 86_400_000
}

export function useAllSwapTransactions(): TransactionDetails[] {
	const { chainId } = useWeb3React()

	const txs = useTxStore((state) => state.txs)

	return useMemo(() => {
		if (chainId == null) return []
		return Object.values(txs[chainId] ?? {})
			.filter((tx) => tx.swap != null)
			.sort((a: TransactionDetails, b: TransactionDetails) => b.addedTime - a.addedTime)
	}, [txs, chainId])
}

/**
 * Returns whether a transaction happened in the last 4 minutes
 * @param tx to check for recency
 */
export function isTransactionSuperRecent(tx: TransactionDetails): boolean {
	return new Date().getTime() - tx.addedTime < 120_000
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(tokenAddress: string | undefined, spender: string | undefined): boolean {
	const allTransactions = useAllTransactions()
	return useMemo(
		() =>
			typeof tokenAddress === 'string' &&
			typeof spender === 'string' &&
			Object.keys(allTransactions).some((hash) => {
				const tx = allTransactions[hash]
				if (!tx) return false
				if (tx.receipt) {
					return false
				}
				const { approval } = tx
				if (!approval) return false
				return approval.spender === spender && approval.tokenAddress === tokenAddress && isTransactionSuperRecent(tx)
			}),
		[allTransactions, spender, tokenAddress]
	)
}

export function usePendingApprovalState(tokenAddress: string | undefined, spender: string | undefined, amount: Nullable<string>): TxStatusAndHash {
	const allTransactions = useAllTransactions()
	return useMemo(() => {
		if (tokenAddress == null || spender == null) return { txStatus: TxStatus.Incomplete, txHash: null }
		const matchedTx = Object.values(allTransactions).find((txDetails) => {
			const tx = allTransactions[txDetails.hash]
			if (tx == null || tx.approval == null) return false
			return (
				tx.approval.spender === spender &&
				tx.approval.tokenAddress === tokenAddress &&
				tx.approval.amount === amount &&
				!tx.acknowledged &&
				isTransactionSuperRecent(tx)
			)
		})

		if (matchedTx?.receipt != null) return { txStatus: TxStatus.Finalized, txHash: matchedTx?.hash ?? null }
		if (matchedTx != null) return { txStatus: TxStatus.Pending, txHash: matchedTx?.hash ?? null }
		return { txStatus: TxStatus.Incomplete, txHash: null }
	}, [allTransactions, spender, tokenAddress, amount])
}

export function usePendingWrapState(wrapAmount: string | null, unwrapAmount: string | null): TxStatusAndHash {
	const allTransactions = useAllTransactions()
	return useMemo(() => {
		if (wrapAmount == null && unwrapAmount == null) return { txStatus: TxStatus.Incomplete, txHash: null }
		const matchedTx = Object.values(allTransactions).find((txDetails) => {
			const tx = allTransactions[txDetails.hash]
			if (tx == null || tx.wrap == null) return false
			return tx.wrap.wrapAmount === wrapAmount && tx.wrap.unwrapAmount === unwrapAmount && !tx.acknowledged && isTransactionSuperRecent(tx)
		})

		if (matchedTx?.receipt != null) return { txStatus: TxStatus.Finalized, txHash: matchedTx?.hash ?? null }
		if (matchedTx != null) return { txStatus: TxStatus.Pending, txHash: matchedTx?.hash ?? null }
		return { txStatus: TxStatus.Incomplete, txHash: null }
	}, [wrapAmount, unwrapAmount, allTransactions])
}

export function usePendingSwapState(
	inputAddress: string | undefined,
	exactIn: string | undefined,
	outputAddress: string | undefined,
	exactOut: string | undefined
): TxStatusAndHash {
	const allTransactions = useAllTransactions()
	return useMemo(() => {
		if (inputAddress == null || outputAddress == null || (exactIn == null && exactOut == null)) return { txStatus: TxStatus.Incomplete, txHash: null }
		const matchedTx = Object.values(allTransactions).find((txDetails) => {
			const tx = allTransactions[txDetails.hash]
			if (tx == null || tx.swap == null) return false
			return (
				tx.swap.inputAddress === inputAddress &&
				tx.swap.exactIn === exactIn &&
				tx.swap.outputAddress === outputAddress &&
				tx.swap.exactOut === exactOut &&
				!tx.acknowledged &&
				isTransactionSuperRecent(tx)
			)
		})

		if (matchedTx?.receipt != null) return { txStatus: TxStatus.Finalized, txHash: matchedTx?.hash ?? null }
		if (matchedTx != null) return { txStatus: TxStatus.Pending, txHash: matchedTx?.hash ?? null }
		return { txStatus: TxStatus.Incomplete, txHash: null }
	}, [allTransactions, inputAddress, exactIn, outputAddress, exactOut])
}

export function usePendingSetReferralCodeState(code: string | null): TxStatusAndHash {
	const allTransactions = useAllTransactions()
	return useMemo(() => {
		if (code == null) return { txStatus: TxStatus.Incomplete, txHash: null }
		const matchedTx = Object.values(allTransactions).find((txDetails) => {
			const tx = allTransactions[txDetails.hash]
			if (tx == null || tx.setReferralCode == null) return false
			return tx.setReferralCode.code === code && !tx.acknowledged && isTransactionSuperRecent(tx)
		})

		if (matchedTx?.receipt != null) return { txStatus: TxStatus.Finalized, txHash: matchedTx?.hash ?? null }
		if (matchedTx != null) return { txStatus: TxStatus.Pending, txHash: matchedTx?.hash ?? null }
		return { txStatus: TxStatus.Incomplete, txHash: null }
	}, [allTransactions, code])
}

export function usePendingSetReferrerState(code: Nullable<string>): TxStatusAndHash {
	const allTransactions = useAllTransactions()
	return useMemo(() => {
		if (code == null) return { txStatus: TxStatus.Incomplete, txHash: null }
		const matchedTx = Object.values(allTransactions).find((txDetails) => {
			const tx = allTransactions[txDetails.hash]
			if (tx == null || tx.setReferrer == null) return false
			return tx.setReferrer.code === code && !tx.acknowledged && isTransactionSuperRecent(tx)
		})

		if (matchedTx?.receipt != null) return { txStatus: TxStatus.Finalized, txHash: matchedTx?.hash ?? null }
		if (matchedTx != null) return { txStatus: TxStatus.Pending, txHash: matchedTx?.hash ?? null }
		return { txStatus: TxStatus.Incomplete, txHash: null }
	}, [allTransactions, code])
}

export function useSubscribeToTransaction(txHash: string | null): TransactionDetails | null {
	const allTransactions = useAllTransactions()
	return useMemo(() => (txHash != null ? allTransactions[txHash] || null : null), [txHash, allTransactions])
}
export function useSubscribeToTransactionState(txHash: string | null): boolean {
	const tx = useSubscribeToTransaction(txHash)
	return useMemo(() => (tx == null ? false : tx.confirmedTime != null), [tx])
}
