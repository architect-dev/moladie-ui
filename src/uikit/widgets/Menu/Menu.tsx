import React, { ReactNode } from 'react'
import styled from 'styled-components'
import Flex from '../../components/Box/Flex'
import UserBlock from './UserBlock'
import { NavProps } from './types'
import { MENU_HEIGHT } from './config'
import NavLinks from './NavLinks'
import { Header } from '@components/Header'
import Page from '@components/layout/Page'
import { Footer } from '@components/Footer'
import { Version } from '@components/Version'

const Wrapper = styled.div`
	position: relative;
	width: 100%;
	min-height: 100%;
`

const StyledNav = styled.nav<{ showMenu: boolean }>`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	transition: top 0.2s;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-left: 16px;
	padding-right: 16px;
	width: 100vw;
	height: ${MENU_HEIGHT}px;
	z-index: 20;
	transform: translate3d(0, 0, 0);
	flex-direction: row;
	max-width: min(100vw, 1100px);
	margin: auto;
`

const BodyWrapper = styled.div`
	position: relative;
	display: flex;
`

const Inner = styled.div<{ showMenu: boolean }>`
	flex-grow: 1;
	/* margin-top: ${MENU_HEIGHT}px; */
	transform: translate3d(0, 0, 0);
	max-width: 100%;
`

const FooterRow = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	align-items: center;
	justify-content: center;
	min-height: 36px;
`

const Menu: React.FC<NavProps & { children: ReactNode }> = ({ account, login, logout, isDark, toggleTheme, links, children }) => {
	return (
		<Wrapper>
			<StyledNav showMenu>
				<Header />

				<Flex alignItems='center' justifyContent='flex-start' gap='24px'>
					<NavLinks links={links} account={account} mobileNav={false} />
				</Flex>

				<Flex alignItems='center' justifyContent='center' gap='10px'>
					<UserBlock account={account} login={login} logout={logout} isDark={isDark} toggleTheme={toggleTheme} />
				</Flex>
			</StyledNav>
			<BodyWrapper>
				<Inner showMenu>
					<Page>{children}</Page>
				</Inner>
			</BodyWrapper>
			<FooterRow>
				<Footer />
				<Version />
			</FooterRow>
		</Wrapper>
	)
}

export default Menu
