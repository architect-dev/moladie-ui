import { TextButton } from '@uikit'
import { RefreshCw } from 'react-feather'

export const RefreshButton: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
	return (
		<TextButton onClick={onRefresh}>
			<RefreshCw size='14px' />
		</TextButton>
	)
}
