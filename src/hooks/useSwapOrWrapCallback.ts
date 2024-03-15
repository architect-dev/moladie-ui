import { useAggregatorStore } from '@state/aggregator/store'
import useSwapCallback from './useSwapCallback'
import useWrapCallback from './useWrapCallback'

const useSwapOrWrapCallback = (permitCallData: string | null) => {
	const isWrap = useAggregatorStore((state) => state.swapData?.trade.isWrapOrUnwrap)
	const wrapCallback = useWrapCallback(permitCallData)
	const swapCallback = useSwapCallback(permitCallData)
	return isWrap ? wrapCallback : swapCallback
}

export default useSwapOrWrapCallback
