import { useAggregatorStore } from '@state/aggregator/store'
import { SummitPopUp, TextButton } from '@uikit'
import { GitCommit } from 'react-feather'
import { SlippageModalContent } from './SlippageModalContent'

export const SlippageButton: React.FC = () => {
	const slippage = useAggregatorStore((state) => state.slippage)

	return (
		<SummitPopUp
			modal
			button={
				<TextButton>
					<GitCommit size='14px' />
					{slippage / 100}%
				</TextButton>
			}
			popUpTitle='Slippage:'
			popUpContent={<SlippageModalContent />}
		/>
	)
}
