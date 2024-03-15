export interface Call {
	address: string
	callData: string
}

export interface ListenerOptions {
	// how often this data should be fetched, by default 1
	readonly blocksPerFetch?: number
}

export interface CallsState {
	callListeners: {
		// on a per-chain basis
		[chainId: number]: {
			// stores for each call key the listeners' preferences
			[callKey: string]: {
				// stores how many listeners there are per each blocks per fetch preference
				[blocksPerFetch: number]: number
			}
		}
	}

	callResults: {
		[chainId: number]: {
			[callKey: string]: {
				data?: string | null
				blockNumber?: number
				fetchingBlockNumber?: number
			}
		}
	}
}

export interface CallsMutators {
	addMulticallListeners: (payload: { chainId: number; calls: Call[]; options?: ListenerOptions }) => void
	removeMulticallListeners: (payload: { chainId: number; calls: Call[]; options?: ListenerOptions }) => void
	fetchingMulticallResults: (payload: { chainId: number; calls: Call[]; fetchingBlockNumber: number }) => void
	errorFetchingMulticallResults: (payload: { chainId: number; calls: Call[]; fetchingBlockNumber: number }) => void
	updateMulticallResults: (payload: { chainId: number; blockNumber: number; results: { [callKey: string]: string | null } }) => void
}

export interface CallsStore extends CallsState, CallsMutators {}
