import { SummitPopUp, TextButton, ModalContentContainer } from '@uikit'
import { Hexagon } from 'react-feather'
import { DebugRow, InfApprovalsSettingRow, InfPermitsSettingRow, RoutePriorityRow } from './SettingsRows'

export const SettingsButton: React.FC = () => {
	return (
		<SummitPopUp
			modal
			button={
				<TextButton>
					<Hexagon size='14px' />
				</TextButton>
			}
			popUpTitle='Settings:'
			popUpContent={
				<ModalContentContainer minWidth='300px' maxHeight='600px' gap='18px'>
					<br />
					<InfApprovalsSettingRow />
					<InfPermitsSettingRow />
					<RoutePriorityRow />
					<DebugRow />
					<br />
				</ModalContentContainer>
			}
		/>
	)
}
