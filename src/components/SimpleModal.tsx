import { ModalContentContainer, SummitPopUp } from '@uikit'

export const SimpleModal: React.FC<{ children?: React.ReactNode; title: string; open: boolean; setOpen: (open: boolean) => void }> = ({
	children,
	title,
	open,
	setOpen,
}) => {
	return (
		<SummitPopUp
			modal
			open={open}
			callOnDismiss={() => setOpen(false)}
			popUpTitle={title}
			popUpContent={
				<ModalContentContainer minWidth='300px' maxHeight='600px' gap='8px'>
					<br />
					{children}
					<br />
				</ModalContentContainer>
			}
		/>
	)
}
