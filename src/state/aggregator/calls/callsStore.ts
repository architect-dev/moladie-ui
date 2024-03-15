import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { toCallKey } from './callsUtils'
import { CallsStore } from './callsTypes'
import { CHAIN_ID } from '@utils'

export const useCallsStore = create<CallsStore>()(
	persist(
		immer((set, get) => ({
			// STATE
			callListeners: {},
			callResults: {},

			// MUTATORS
			addMulticallListeners: ({ calls, chainId, options: { blocksPerFetch = 1 } = {} }) => {
				set((state) => {
					if (state.callListeners[chainId] == null) {
						state.callListeners[chainId] = {}
					}
					calls.forEach((call) => {
						const callKey = toCallKey(call)
						if (state.callListeners[chainId][callKey] == null) {
							state.callListeners[chainId][callKey] = {}
						}
						state.callListeners[chainId][callKey][blocksPerFetch] = (state.callListeners[chainId][callKey][blocksPerFetch] ?? 0) + 1
					})
				})
			},
			removeMulticallListeners: ({ chainId, calls, options: { blocksPerFetch = 1 } = {} }) => {
				if (get().callListeners[chainId] == null) return

				set((state) => {
					calls.forEach((call) => {
						const callKey = toCallKey(call)
						if (!state.callListeners[chainId][callKey]) return
						if (!state.callListeners[chainId][callKey][blocksPerFetch]) return

						if (state.callListeners[chainId][callKey][blocksPerFetch] === 1) {
							delete state.callListeners[chainId][callKey][blocksPerFetch]
						} else {
							state.callListeners[chainId][callKey][blocksPerFetch]--
						}
					})
				})
			},
			fetchingMulticallResults: ({ chainId, calls, fetchingBlockNumber }) => {
				set((state) => {
					if (state.callResults[chainId] == null) {
						state.callResults[chainId] = {}
					}

					calls.forEach((call) => {
						const callKey = toCallKey(call)
						const current = state.callResults[chainId][callKey]
						if (!current) {
							state.callResults[chainId][callKey] = {
								fetchingBlockNumber,
							}
						} else {
							if ((current.fetchingBlockNumber ?? 0) >= fetchingBlockNumber) return
							state.callResults[chainId][callKey].fetchingBlockNumber = fetchingBlockNumber
						}
					})
				})
			},
			errorFetchingMulticallResults: ({ chainId, calls, fetchingBlockNumber }) => {
				set((state) => {
					if (state.callResults[chainId] == null) {
						state.callResults[chainId] = {}
					}

					calls.forEach((call) => {
						const callKey = toCallKey(call)
						const current = state.callResults[chainId][callKey]
						if (!current) return // only should be dispatched if we are already fetching
						if (current.fetchingBlockNumber === fetchingBlockNumber) {
							delete state.callResults[chainId][callKey].fetchingBlockNumber
							state.callResults[chainId][callKey].data = null
							state.callResults[chainId][callKey].blockNumber = fetchingBlockNumber
						}
					})
				})
			},
			updateMulticallResults: ({ chainId, results, blockNumber }) => {
				set((state) => {
					if (state.callResults[chainId] == null) {
						state.callResults[chainId] = {}
					}

					Object.keys(results).forEach((callKey) => {
						const current = state.callResults[chainId][callKey]
						if ((current?.blockNumber ?? 0) > blockNumber) return
						state.callResults[chainId][callKey] = {
							data: results[callKey],
							blockNumber,
						}
					})
				})
			},
		})),
		{
			name: `summit_aggregator_calls_${CHAIN_ID}`,
		}
	)
)
