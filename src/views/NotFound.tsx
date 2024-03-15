import styled from 'styled-components'
import { Heading, Text } from '@uikit'
import Page from '@components/layout/Page'
import SummitButton from '@uikit/components/Button/SummitButton'
import { Link } from 'react-router-dom'

const StyledNotFound = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	height: calc(100vh - 264px);
	justify-content: center;
`

const NotFound = () => {
	return (
		<Page>
			<StyledNotFound>
				<Heading style={{ fontSize: '100px' }}>404</Heading>
				<Text monospace mb='48px'>
					Page Not Found
				</Text>
				<SummitButton as={Link} to='/' replace>
					HOME
				</SummitButton>
			</StyledNotFound>
		</Page>
	)
}

export default NotFound
