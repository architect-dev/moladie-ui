import styled from 'styled-components'

export const UnderlayCard = styled.div`
	display: flex;
	flex-direction: column;
	padding: 2px 0px 12px 0px;
	position: relative;
	max-width: 100%;

	:before {
		content: ' ';
		position: absolute;
		top: 0;
		left: 2px;
		right: 2px;
		bottom: 0px;
		background-color: ${({ theme }) => `${theme.colors.background}${theme.isDark ? 40 : 80}`};
		border-radius: 8px;
		z-index: -1;
	}
`
