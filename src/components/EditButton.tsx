import { TextButton } from '@uikit'
import { Edit2 } from 'react-feather'

export const EditButton: React.FC<{ onEdit: () => void }> = ({ onEdit }) => {
	return (
		<TextButton onClick={onEdit}>
			<Edit2 size='14px' />
		</TextButton>
	)
}
