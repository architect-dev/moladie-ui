import { Text } from '@uikit'
import styled from 'styled-components'

const VersionContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 16px;
	padding: 2px 16px;
	background-color: ${({ theme }) => `${theme.colors.background}${theme.isDark ? 40 : 80}`};
	border-radius: 8px;
	width: min-content;
	position: absolute;
	right: 10px;
	/* position: absolute;
	bottom: 10px;
	right: 10px; */
`

export const Version: React.FC = () => {
	return (
		<VersionContainer>
			<Text>v0.6.2m</Text>
		</VersionContainer>
	)
}
