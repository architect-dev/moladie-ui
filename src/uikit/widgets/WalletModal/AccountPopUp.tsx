import React, { useCallback } from 'react'
import { Text } from '../../components/Text/Text'
import Flex, { RowBetween } from '../../components/Box/Flex'
import CopyToClipboardButton from './CopyToClipboard'
import { connectorLocalStorageKey } from './config'
import SummitButton from '../../components/Button/SummitButton'
import ExternalLinkButton from '../../components/Link/ExternalLinkButton'
import { getLinks } from '@config/constants'
import styled from 'styled-components'
import Divider from '@uikit/components/Divider'
import DarkModeToggle from '../Menu/DarkModeToggle'
import { ChainIcon } from '@uikit/components/Svg'
import { ModalContentContainer } from '../Popup/SummitPopUp'
import { grainyGradientMixin } from '@uikit/util/styledMixins'
import { HighlightedItem } from '@components/HighlightedItem'
import { usePointsStore } from '@state/aggregator/points/pointsStore'
import { CHAIN_ID } from '@utils'
import { Link } from 'react-router-dom'

const AccountDot = styled.div`
	width: 42px;
	height: 42px;
	border-radius: 22px;
	margin-right: 12px;
	display: flex;
	align-items: center;
	justify-content: center;

	${({ theme }) => grainyGradientMixin(!theme.isDark)}
`

const StyledChainIcon = styled(ChainIcon)`
	width: 22px;
	height: 22px;
	fill: ${({ theme }) => theme.colors.buttonText};
	z-index: 2;
`

interface Props {
	account: string
	isDark: boolean
	toggleTheme: () => void
	logout: () => void
	onDismiss?: () => void
}

const HighlightedItemButton = styled.div`
	width: 100%;
	height: 60px;
	cursor: pointer;

	box-shadow: 0px 5px 10px ${({ theme }) => theme.colors.text}20;
	&:hover:not(:active) {
		box-shadow: 0px 10px 20px ${({ theme }) => theme.colors.text}50;
	}

	&:active:not(:disabled) {
		box-shadow: 0px 10px 20px ${({ theme }) => theme.colors.text}20;
	}
`

const SummitPointsSection: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
	const points = usePointsStore((state) => state.pointsData?.pointsTotal)

	return (
		<HighlightedItemButton as={Link} to='/points' onClick={onDismiss} replace>
			<HighlightedItem height='60px' noAnim>
				<RowBetween padding='0px 14px'>
					<Text color='white' fontSize='14px'>
						SUMMIT POINTS
					</Text>
					<Text color='white' fontSize='18px' letterSpacing='2px'>
						{points == null ? '...' : points.toFixed(3)}
					</Text>
				</RowBetween>
			</HighlightedItem>
		</HighlightedItemButton>
	)
}

const AccountPopUp: React.FC<Props> = ({ account, isDark, toggleTheme, logout, onDismiss = () => null }) => {
	const chain = parseInt(CHAIN_ID)
	const { etherscan } = getLinks()
	const accountEtherscanLink = `${etherscan}address/${account}`
	const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null

	const getChainName = useCallback((chainNum: number) => {
		if (chainNum === 250) return 'FANTOM'
		if (chainNum === 168587773) return 'BLAST SEPOLIA'
		if (chainNum === 81457) return 'BLAST'
		return 'POLYGON'
	}, [])

	return (
		<ModalContentContainer gap='12px' width='300px' padding='18px 0px'>
			<Flex width='100%' alignItems='center' justifyContent='space-between'>
				<Text bold monospace>
					ACCOUNT
				</Text>
				<SummitButton
					height='28px'
					width='120px'
					onClick={() => {
						logout()
						window.localStorage.removeItem(connectorLocalStorageKey)
						onDismiss()
					}}
				>
					<Text monospace small inverted>
						DISCONNECT
					</Text>
				</SummitButton>
			</Flex>

			<Flex width='100%' alignItems='center' justifyContent='space-between'>
				<Flex>
					<AccountDot>
						<StyledChainIcon chain={chain} />
					</AccountDot>
					<Flex flexDirection='column' alignItems='flex-start' justifyContent='center'>
						<Text fontSize='16px' bold monospace>
							{accountEllipsis}
						</Text>
						<Text small mt='-6px' bold monospace>
							{getChainName(chain)}
						</Text>
					</Flex>
				</Flex>
				<Flex gap='8px'>
					<ExternalLinkButton href={accountEtherscanLink} />
					<CopyToClipboardButton toCopy={account} />
				</Flex>
			</Flex>

			<Divider />

			<SummitPointsSection onDismiss={onDismiss} />

			<Divider />

			<Flex width='100%' alignItems='center' justifyContent='space-between'>
				<Text bold monospace>
					Site Theme
				</Text>
				<DarkModeToggle isDark={isDark} toggleTheme={toggleTheme} />
			</Flex>
		</ModalContentContainer>
	)
}

export default AccountPopUp
