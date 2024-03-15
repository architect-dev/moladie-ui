import styled from 'styled-components'
import Container from './Container'

const Page = styled(Container)`
	display: flex;
	flex-direction: column;
	min-height: max(800px, calc(100vh - 36px));
	max-width: 1100px;
	padding-left: 8px;
	padding-right: 8px;
	padding-top: 90px;
	padding-bottom: 24px;
	align-items: center;
	position: relative;
	justify-content: center;
`

export default Page
