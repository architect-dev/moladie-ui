import { useAggregatorStore } from '@state/aggregator/store'
import { TextButton } from '@uikit'
import { RefreshCw } from 'react-feather'

export const RefreshSwapButton: React.FC = () => {
	const refreshSwap = useAggregatorStore((state) => state.refreshSwap)
	return (
		<TextButton onClick={refreshSwap}>
			<RefreshCw size='14px' />
		</TextButton>
	)
}
