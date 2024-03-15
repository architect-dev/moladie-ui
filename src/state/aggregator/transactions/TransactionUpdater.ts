import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useBlockNumber, useTxStore } from './txStore'
import { SerializableTransactionReceipt } from './txTypes'
import useToast from '@hooks/useToast'
import { toastTypes } from '@uikit'

export function shouldCheck(lastBlockNumber: number, tx: { addedTime: number; receipt?: any; lastCheckedBlockNumber?: number }): boolean {
	if (tx.receipt) return false
	if (!tx.lastCheckedBlockNumber) return true
	const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
	if (blocksSinceCheck < 1) return false
	const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
	if (minutesPending > 60) {
		// every 10 blocks if pending for longer than an hour
		return blocksSinceCheck > 9
	}
	if (minutesPending > 5) {
		// every 3 blocks if pending more than 5 minutes
		return blocksSinceCheck > 2
	}
	// otherwise every block
	return true
}

export default function TransactionUpdater(): null {
	const { chainId, library } = useWeb3React()

	const lastBlockNumber = useBlockNumber()
	const transactions = useTxStore((state) => (chainId ? state.txs[chainId] ?? {} : {}))
	const finalizeTransaction = useTxStore((state) => state.finalizeTransaction)
	const checkedTransaction = useTxStore((state) => state.checkedTransaction)
	const { toastSuccess, toastError, toast } = useToast()

	useEffect(() => {
		if (!chainId || !library || !lastBlockNumber) return

		Object.keys(transactions)
			.filter((hash) => shouldCheck(lastBlockNumber, transactions[hash]))
			.forEach((hash) => {
				library
					.getTransactionReceipt(hash)
					.then((receipt?: SerializableTransactionReceipt) => {
						if (receipt) {
							finalizeTransaction({
								chainId,
								hash,
								receipt: {
									blockHash: receipt.blockHash,
									blockNumber: receipt.blockNumber,
									contractAddress: receipt.contractAddress,
									from: receipt.from,
									status: receipt.status,
									to: receipt.to,
									transactionHash: receipt.transactionHash,
									transactionIndex: receipt.transactionIndex,
								},
							})

							const success = receipt.status === 1
							console.log('tx', transactions[hash])
							const txSummary = transactions[hash]?.summary

							toast({
								title: 'Transaction',
								description: txSummary,
								hash,
								type: success ? toastTypes.SUCCESS : toastTypes.DANGER,
							})
						} else {
							checkedTransaction({ chainId, hash, blockNumber: lastBlockNumber })
						}
					})
					.catch((error: any) => {
						console.error(`failed to check transaction hash: ${hash}`, error)
					})
			})
	}, [chainId, library, transactions, lastBlockNumber, finalizeTransaction, checkedTransaction, toastSuccess, toastError, toast])

	return null
}
