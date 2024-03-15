import { useCallback, useEffect, useState } from 'react'
import useIsWindowVisible from '@hooks/useIsWindowVisible'
import useDebounce from '@hooks/useDebounce'
import { useTxStore } from './txStore'
import useActiveWeb3React from '@hooks/useActiveWeb3React'
import useRefresh from '@hooks/useRefresh'

export default function BlockNumberUpdater(): null {
	const { library, chainId } = useActiveWeb3React()
	const { fastRefresh } = useRefresh()
	const updateBlockNumber = useTxStore((state) => state.updateBlockNumber)

	const windowVisible = useIsWindowVisible()

	const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
		chainId,
		blockNumber: null,
	})

	const blockNumberCallback = useCallback(
		(blockNumber: number) => {
			setState((s) => {
				if (chainId === s.chainId) {
					if (typeof s.blockNumber !== 'number') return { chainId, blockNumber }
					return { chainId, blockNumber: Math.max(blockNumber, s.blockNumber) }
				}
				return s
			})
		},
		[chainId, setState]
	)

	// attach/detach listeners
	useEffect(() => {
		if (!library || !chainId || !windowVisible) return undefined

		// setState({ chainId, blockNumber: null })

		library
			.getBlockNumber()
			.then(blockNumberCallback)
			.catch((error: any) => console.error(`Failed to get block number for chainId: ${chainId}`, error))

		// library.on('block', blockNumberCallback)
		// return () => {
		// 	library.removeListener('block', blockNumberCallback)
		// }
	}, [chainId, library, blockNumberCallback, windowVisible, fastRefresh])

	const debouncedState = useDebounce(state, 100)

	useEffect(() => {
		if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
		updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber })
	}, [windowVisible, debouncedState.blockNumber, debouncedState.chainId, updateBlockNumber])

	return null
}
