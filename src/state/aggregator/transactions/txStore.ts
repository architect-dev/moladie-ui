import { CHAIN_ID } from '@utils'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { TransactionDetails, TxState } from './txTypes'
import { useTokenStore } from '../tokens/tokenStore'
import { useAggregatorStore } from '../store'
import { zeroAdd } from '@config/constants'
import { usePointsStore } from '../points/pointsStore'
import { WNATIVE } from '@config/deployments'
import useActiveWeb3React from '@hooks/useActiveWeb3React'
import { orderBy } from 'lodash'

const now = () => new Date().getTime()

const fireTransactionFinalizedActions = (tx: TransactionDetails) => {
	const account = useAggregatorStore.getState().account

	// Update token in and out data on swapped
	if (tx.swap) {
		useTokenStore.getState().fetchTokenData(account ?? zeroAdd, tx.swap.inputAddress)
		useTokenStore.getState().fetchTokenData(account ?? zeroAdd, tx.swap.outputAddress)
	}

	// Update token in and out data on wrapped
	if (tx.wrap) {
		useTokenStore.getState().fetchTokenData(account ?? zeroAdd, zeroAdd)
		useTokenStore.getState().fetchTokenData(account ?? zeroAdd, WNATIVE.address)
	}

	// Update token in data on approved
	if (tx.approval) {
		useTokenStore.getState().fetchTokenData(account ?? zeroAdd, tx.approval.tokenAddress)
	}

	// Refresh referrals and points
	if (tx.swap || tx.setReferralCode || tx.setReferrer) {
		usePointsStore.getState().fetchAndSetPointsData(account)
		usePointsStore.getState().fetchAndSetReferralsData(account)
		usePointsStore.setState({ fetchingReferralCodeAvailable: false, referralCodeAvailable: false })
	}
}

export const useTxStore = create<TxState>()(
	persist(
		immer((set, get) => ({
			// State
			txs: {},
			blockNumber: {},

			// Mutators
			addTransaction: ({ chainId, from, hash, approval, swap, wrap, summary, setReferralCode, setReferrer }) => {
				if (get().txs?.[chainId]?.[hash]) {
					throw Error('Attempted to add existing transaction.')
				}
				set((state) => {
					if (state.txs[chainId] == null) {
						state.txs[chainId] = {}
					}
					state.txs[chainId][hash] = { hash, approval, swap, wrap, summary, setReferralCode, setReferrer, from, addedTime: now() }
				})
			},
			clearAllTransactions: ({ chainId }) => {
				if (get().txs[chainId] == null) return
				set((state) => {
					state.txs[chainId] = {}
				})
			},
			finalizeTransaction: ({ chainId, hash, receipt }) => {
				const tx = get().txs[chainId]?.[hash]
				if (tx == null) {
					return
				}

				// Refetch data after transaction finalized in certain cases
				fireTransactionFinalizedActions(tx)

				// Persist data
				set((state) => {
					state.txs[chainId][hash].receipt = receipt
				})
			},
			checkedTransaction: ({ chainId, hash, blockNumber }) => {
				const tx = get().txs[chainId]?.[hash]
				if (tx == null) {
					return
				}
				if (tx.lastCheckedBlockNumber == null) {
					set((state) => {
						state.txs[chainId][hash].lastCheckedBlockNumber = blockNumber
					})
				} else {
					set((state) => {
						state.txs[chainId][hash].lastCheckedBlockNumber = Math.max(blockNumber, tx.lastCheckedBlockNumber!)
					})
				}
			},
			acknowledgeTransaction: ({ hash, chainId }) => {
				const tx = get().txs[chainId]?.[hash]
				if (tx == null) {
					return
				}
				set((state) => {
					state.txs[chainId][hash].acknowledged = true
				})
			},
			// addTransactionSet: ({}) => {},

			updateBlockNumber: ({ chainId, blockNumber }) => {
				set((state) => {
					state.blockNumber[chainId] = blockNumber
				})
			},
		})),
		{
			name: `summit_aggregator_txs_${CHAIN_ID}`,
		}
	)
)

export const useBlockNumber = () => {
	return useTxStore((state) => state.blockNumber[CHAIN_ID])
}

export const useTxHistory = () => {
	const { chainId } = useActiveWeb3React()
	const txList = useTxStore((state) => {
		return chainId && state.txs[chainId] != null ? orderBy(Object.values(state.txs[chainId]), ['addedTime'], ['desc']) : []
	})
	return txList
}
