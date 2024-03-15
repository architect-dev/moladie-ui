import styled, { DefaultTheme, css } from 'styled-components'
import { Text, Column } from '@uikit'
import { IntActionState } from './types'

export const StepImgWidth = '181px'
export const StepImgHeight = '200px'
export const CompletedImgWidth = '181px'
export const CompletedImgHeight = '200px'

export const Content = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 24px;
	padding: 16px;
	max-width: 480px;
`

export const StepsContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`

export const StepInteractionContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	flex: 1;
	gap: 24px;
	width: 100%;
`

export const ImgWrapper = styled.div<{ boost: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: ${({ boost }) => `calc(${StepImgWidth} * ${boost ? 1.2 : 1})`};
	height: ${({ boost }) => `calc(${StepImgHeight} * ${boost ? 1.2 : 1})`};
`

export const StepInteractionTextContainer = styled.div`
	display: flex;
	flex: 1;
	justify-content: center;
	align-items: center;
	margin-left: 34px;
	margin-right: 34px;
`
export const StepInteractionText = styled(Text)`
	text-align: center;
`

export const SequentialItemWrapper = styled.div<{ collapsible?: boolean; expanded?: boolean }>`
	display: flex;
	flex-direction: column;

	&:last-child {
		.item-second-row {
			border-left-color: transparent;
		}
	}
`

export const TransactionStatusIcon = styled(Column)`
	align-items: center;
	padding: 40px 0;
`

export const InterItemLineBorder = ({ theme, state }: { theme: DefaultTheme; state: IntActionState }) => {
	let style: string
	let color: string
	switch (state) {
		case IntActionState.WaitingForAction:
			style = 'dashed'
			color = theme.colors.text
			break
		case IntActionState.Complete:
			style = 'solid'
			color = theme.colors.text
			break
		case IntActionState.InQueue:
			style = 'solid'
			color = theme.colors.text
			break
		case IntActionState.Error:
			style = 'dashed'
			color = theme.colors.failure
			break
		case IntActionState.Pending:
			style = 'dashed'
			color = theme.colors.warning
	}
	return css`
		border-left: 1.5px ${style} ${color};
	`
}

export const PendingText = styled(Text)`
	font-weight: 400;
	color: ${({ theme }) => theme.colors.text};
`

export const ItemSecondRow = styled.div<{ state: IntActionState }>`
	${InterItemLineBorder}
	margin-left: 7px;
	padding-left: 22px;
	min-height: 4px;
	padding-top: 11px;
	padding-bottom: 22px;
`

export const SecondRowText = styled(Text)`
	font-size: 14px;
	font-weight: 400;
	line-height: 20px;
	margin-top: 4px;
	margin-bottom: 4px;
`

export const ItemTitleText = styled(Text)<{ bold: boolean; err: boolean }>`
	font-size: 14px;
	line-height: 24px;
	gap: 4px;
	display: flex;
	font-weight: ${({ bold }) => (bold ? 700 : 400)};
	color: ${({ err, theme }) => (err ? theme.colors.failure : theme.colors.text)};
`
