import styled, { keyframes } from 'styled-components'
import { Text } from '@uikit'

const PopUp = keyframes`
  0% {
		opacity: 0;
    transform: translateY(0px);
	}
  1% {
    opacity: 1;
    transform: translateY(0px);
  }
  90% {
    opacity: 1;
    transform: translateY(0px);
  }
  100% {
		opacity: 0;
    transform: translateY(2px);
	}
`

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0;
	position: absolute;
	min-width: max-content;
	top: -30px;
	padding: 2px 6px;
	border-radius: 8px;
	background-color: ${({ theme }) => theme.colors.background};
	box-shadow: ${({ theme }) => `0px 10px 20px ${theme.colors.text}40`};
	animation: ${PopUp} 1s linear forwards;
`

const CopiedIndicator = () => {
	return (
		<Container>
			<Text small>✔ copied</Text>
		</Container>
	)
}

export default CopiedIndicator
