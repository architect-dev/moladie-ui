import { useAggregatorStore } from '@state/aggregator/store'
import { SummitPopUp, TextButton } from '@uikit'
import { GitMerge } from 'react-feather'
import { SwapRouteModalContent } from './SwapRouteModalContent'

export const SwapRouteButton: React.FC = () => {
	const swapData = useAggregatorStore((state) => state.swapData)
	const swapDataDirty = useAggregatorStore((state) => state.swapDataDirty)
	const swapOrWrap = swapData?.trade.isWrapOrUnwrap ? 'Wrap' : 'Swap'

	return (
		<SummitPopUp
			modal
			button={
				<TextButton disabled={swapDataDirty || !swapData?.valid}>
					<GitMerge size='14px' />
					Route Info
				</TextButton>
			}
			popUpTitle={`${swapOrWrap} Route:`}
			popUpContent={<SwapRouteModalContent />}
		/>
	)
}
