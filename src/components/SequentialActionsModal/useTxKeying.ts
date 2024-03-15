import { useAggregatorStore } from '@state/aggregator/store'

export function useUniqueTxKeying() {
	const swapData = useAggregatorStore((state) => state.swapData)
	if (swapData?.trade.isWrapOrUnwrap) {
		return `wrap_${swapData?.tokenIn}_${swapData?.tokenInAmount}_${swapData?.tokenOut}`
	}
	return `swap_${swapData?.tokenIn}_${swapData?.tokenInAmount}_${swapData?.tokenOut}`
}
