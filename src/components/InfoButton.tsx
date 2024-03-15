import { TextButton } from '@uikit'
import { HelpCircle } from 'react-feather'

export const InfoButton: React.FC<{ onInfo: () => void }> = ({ onInfo }) => {
	return (
		<TextButton onClick={onInfo}>
			<HelpCircle size='14px' />
		</TextButton>
	)
}
