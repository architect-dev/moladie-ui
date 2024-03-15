import React, { useCallback } from 'react'
import styled from 'styled-components'
import { grainyGradientMixin, pressableMixin } from '@uikit/util/styledMixins'
import { Text } from '@uikit/components/Text'
import { Login } from '../WalletModal/types'
import { SummitPopUp } from '@uikit/widgets/Popup'
import ConnectPopUp from '@uikit/widgets/WalletModal/ConnectPopUp'
import AccountPopUp from '@uikit/widgets/WalletModal/AccountPopUp'
import { ChainIcon } from '@uikit/components/Svg'
import { CHAIN_ID, Nullable } from '@utils'
import { Column } from '@uikit/components/Box'
import { useAggregatorStore } from '@state/aggregator/store'

const UserBlockFlex = styled.div`
	display: flex;
	gap: 12px;
	align-items: center;
	justify-content: flex-end;
	${pressableMixin}

	transform: null;

	${({ theme }) => theme.mediaQueries.md} {
		width: 160px;
	}
	/* transition: transform 100ms ease-in-out; */

	:hover:not(:active) {
		.account-dot {
			box-shadow: 0 10px 20px ${({ theme }) => theme.colors.text}60;
		}
		.no-account-fill {
			box-shadow: 0 10px 20px ${({ theme }) => theme.colors.text}60;
		}
		.label {
			text-decoration: underline;
			font-weight: bold;
		}
	}
`

const AccountDot = styled.div<{ connected: boolean }>`
	position: relative;
	width: 36px;
	height: 36px;
	border-radius: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 5px 10px ${({ theme }) => theme.colors.text}20;

	${({ theme }) => theme.mediaQueries.nav} {
		width: 36px;
		height: 36px;
	}

	${({ theme }) => grainyGradientMixin(!theme.isDark)}
`
const NoAccountDot = styled.div`
	position: relative;
	width: 36px;
	height: 36px;
	border-radius: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 5px 10px ${({ theme }) => theme.colors.text}20;

	border: 2px solid ${({ theme }) => theme.colors.text};

	${({ theme }) => theme.mediaQueries.nav} {
		width: 36px;
		height: 36px;
	}
`

const StyledChainIcon = styled(ChainIcon)<{ inv?: boolean }>`
	width: 18px;
	height: 18px;
	fill: ${({ theme, inv }) => (inv ? theme.colors.text : theme.colors.invertedText)};
	z-index: 2;
`

const OnlyMdText = styled(Text)`
	display: none;
	${({ theme }) => theme.mediaQueries.md} {
		display: block;
	}
`

interface Props {
	account: Nullable<string>
	isDark: boolean
	toggleTheme: () => void
	login: Login
	logout: () => void
}

const UserBlock: React.FC<Props> = ({ account, isDark, toggleTheme, login, logout }) => {
	const { connectModalOpen, setConnectModalOpen } = useAggregatorStore((state) => ({
		connectModalOpen: state.connectModalOpen,
		setConnectModalOpen: state.setConnectModalOpen,
	}))
	const chain = parseInt(CHAIN_ID)
	const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null
	const closeConnectModal = useCallback(() => setConnectModalOpen(false), [setConnectModalOpen])

	return (
		<SummitPopUp
			position='bottom right'
			button={
				<UserBlockFlex>
					<Column justifyContent='flex-end'>
						<OnlyMdText className='label' monospace textAlign='right'>
							{account ? accountEllipsis : 'CONNECT'}
						</OnlyMdText>
					</Column>
					{account != null && (
						<AccountDot className='account-dot' connected>
							<StyledChainIcon chain={chain} />
						</AccountDot>
					)}
					{account == null && (
						<NoAccountDot className='no-account-fill'>
							<StyledChainIcon inv chain={81457} />
						</NoAccountDot>
					)}
				</UserBlockFlex>
			}
			popUpContent={
				account != null ? (
					<AccountPopUp account={account} isDark={isDark} toggleTheme={toggleTheme} logout={logout} />
				) : (
					<ConnectPopUp login={login} isDark={isDark} toggleTheme={toggleTheme} />
				)
			}
			open={connectModalOpen}
			callOnDismiss={closeConnectModal}
		/>
	)
}

export default React.memo(UserBlock)
