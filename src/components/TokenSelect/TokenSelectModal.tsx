import React, { useCallback, useMemo, useState } from 'react'
import { Column, ExternalLinkButton, Row, RowBetween, RowCenter, RowStart, SummitButton, Text, TextButton, TokenSymbolImage, useMatchBreakpoints } from '@uikit'
import { transparentize } from 'polished'
import styled, { css } from 'styled-components'
import { grainyGradientMixin, pressableMixin } from '@uikit/util/styledMixins'
import { Nullable, bnDecOffset, getEllipsedAddresses, tryGetAddress } from '@utils'
import { AlertCircle, LogIn, LogOut } from 'react-feather'
import { ModalContentContainer } from '@uikit/widgets/Popup/SummitPopUp'
import { SelectorWrapperBase } from '@uikit/widgets/Selector/styles'
import { useFetchSearchedTokenData, useTokenStore } from '@state/aggregator/tokens/tokenStore'
import { AddressRecord, Token } from '@state/aggregator/types'
import { getMatchedSymbol } from '@config/tokens/symbols'
import { getXScanLink } from '@config/constants'
import { orderBy } from 'lodash'
import { TokenButton } from '@components/TokenButton'

export type ModalVariant = 'tokenIn' | 'tokenOut'

const TokenRowButton = styled(RowBetween)<{ disabled: boolean; boosted?: boolean }>`
	width: 100%;
	padding: 0 18px;
	height: 48px;
	min-height: 48px;
	color: ${({ theme }) => theme.colors.text};
	background-color: ${({ boosted }) => (boosted === true ? transparentize(0.8, '#4b0956') : undefined)};

	${({ theme, disabled, boosted }) =>
		pressableMixin({
			theme,
			disabled,
			hoverStyles: css`
				background-color: ${transparentize(0.9, theme.colors.text)};
			`,
			disabledStyles: css`
				filter: ${boosted ? 'sepia(1)' : 'grayscale(1)'};
			`,
		})}
`

const BaseTokenRow: React.FC<{
	token: Token
	selected: boolean
	disabledReason: Nullable<DisabledReason>
	variant: ModalVariant
	setToken: (token: string) => void
}> = ({ token, disabledReason, setToken }) => {
	const Icon = disabledReason?.key === 'token-in' ? LogIn : disabledReason?.key === 'token-out' ? LogOut : null

	return (
		<TokenButton
			token={token.address}
			disabled={disabledReason != null}
			noTokenString='____'
			onClick={() => setToken(token.address)}
			before={Icon != null && <Icon size='18px' style={{ marginRight: '6px' }} />}
		/>
	)
}

export type DisabledReason = {
	reason: string
	key: 'token-in' | 'token-out'
}

const TokenSelectRow: React.FC<{
	token: Token
	selected: boolean
	disabledReason: Nullable<DisabledReason>
	variant: ModalVariant
	setToken: (token: string) => void
}> = ({ token, variant, disabledReason, setToken }) => {
	const Icon = disabledReason?.key === 'token-in' ? LogIn : disabledReason?.key === 'token-out' ? LogOut : null
	const iconMatchedSymbol = getMatchedSymbol(token.symbol)
	const balance = useMemo(() => {
		switch (variant) {
			case 'tokenOut': {
				const price = token.price?.toFixed(2)
				return price != null ? `$${price}` : '-'
			}
			case 'tokenIn':
			default:
				return token?.userBalance == null || token?.decimals == null ? null : bnDecOffset(token.userBalance, token.decimals)?.toFixed(4)
		}
	}, [token, variant])
	return (
		<TokenRowButton disabled={disabledReason != null} boosted={token.bonus > 0} onClick={() => (disabledReason != null ? null : setToken(token.address))}>
			<Row gap='6px'>
				{Icon != null && <Icon size='14px' />}
				<TokenSymbolImage symbol={iconMatchedSymbol ?? ''} ext={token.ext} width={24} height={24} bonus={token.bonus} />
				<Column>
					<Text bold>{token.symbol}</Text>
					{disabledReason != null && (
						<Text fontSize='11px' mt='-4px'>
							{disabledReason.reason}
						</Text>
					)}
				</Column>
				{token.tax != null && (
					<Text small warn={token.tax != null && token.tax > 100}>
						({(token.tax / 100).toFixed(1)}% TAX)
					</Text>
				)}
			</Row>
			<Text>{balance != null ? balance : '-'}</Text>
		</TokenRowButton>
	)
}

const Scrollable = styled.div`
	display: flex;
	flex-direction: column;
	overflow: scroll;
	align-items: center;
	justify-content: flex-start;
	width: calc(100% + 36px);
	margin: 0 -18px;
`

const HeaderRow = styled(RowBetween)`
	width: 100%;
	padding: 6px;
	border-bottom: 1px solid ${({ theme }) => theme.colors.text};
`

const InputWrapper = styled(SelectorWrapperBase)`
	margin-bottom: 12px;
	width: 100%;
	${({ theme }) => grainyGradientMixin(theme.isDark)}
`

export const TokenSearchInput = styled.input`
	isolation: isolate;
	min-height: 32px;
	height: 32px;
	max-height: 32px;
	border-radius: 16px;

	background: none;
	display: flex;
	width: 100%;
	border: none;
	outline: none;
	color: ${({ theme }) => theme.colors.text};
	::placeholder {
		color: ${({ theme }) => transparentize(0.5, theme.colors.text)};
	}
	font-size: 12px;

	padding: 0 16px;
	white-space: nowrap;
	text-overflow: ellipsis;
	z-index: 2;
	overflow: hidden;

	:focus {
		outline: none;
	}
`

const SearchBar: React.FC<{
	search: string
	setSearch: (str: string) => void
}> = ({ search, setSearch }) => {
	const { isXs, isSm, isMd } = useMatchBreakpoints()
	const isMobile = isXs || isSm || isMd
	const handleInput = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const input = event.target.value
			const checksummedInput = tryGetAddress(input)
			setSearch(checksummedInput || input)
		},
		[setSearch]
	)
	return (
		<InputWrapper>
			<TokenSearchInput
				width='100%'
				type='text'
				id='token-search-input'
				placeholder='Search by Name or Address'
				value={search}
				onChange={handleInput}
				autoComplete='off'
				spellCheck='false'
				autoFocus={!isMobile}
			/>
		</InputWrapper>
	)
}

const CustomTokenSection: React.FC<{ token: Token; onSelect: (token: string) => void }> = ({ token, onSelect }) => {
	const [understood, setUnderstood] = useState(false)
	return (
		<Column padding='16px 24px'>
			<Text red style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }} textAlign='center'>
				<AlertCircle size='14px' />
				New Token Warning:
			</Text>
			<br />
			<br />
			<RowBetween>
				<RowStart gap='6px'>
					<TokenSymbolImage symbol={token.symbol} ext={token.ext} width={24} height={24} bonus={token.bonus} />
					<Text>{token.symbol}</Text>
				</RowStart>
				<ExternalLinkButton href={getXScanLink(token.address, 'token')}>{getEllipsedAddresses(token.address)}</ExternalLinkButton>
			</RowBetween>
			<br />
			<br />
			<Text small style={{ width: '100%' }} textAlign='left'>
				<b>
					Anyone can create a token with any name. Take extra care when interacting with arbitrary tokens, there is <i>no</i> recourse if something goes wrong.
				</b>
				<br />
				<br />
				<br />
				Risks include:
				<br />
				. Fake versions of existing tokens
				<br />
				. Purchasing tokens that can't be sold back
				<br />. Tokens with abnormally high sales tax
			</Text>
			<br />
			<br />
			<TextButton onClick={() => setUnderstood((u) => !u)}>
				<pre>[{understood ? 'X' : ' '}] I Understand</pre>
			</TextButton>
			<br />
			<br />
			<SummitButton disabled={!understood} variant='danger' marginX='auto' onClick={() => onSelect(token.address)}>
				<RowCenter gap='6px'>
					Select <TokenSymbolImage symbol={token.symbol} ext={token.ext} width={24} height={24} /> {token.symbol}
				</RowCenter>
			</SummitButton>
		</Column>
	)
}

const TokenSelectModal: React.FC<{
	selectedTokens: Nullable<string>[]
	disabledReasons?: AddressRecord<DisabledReason>
	variant: ModalVariant
	onDismiss?: () => void
	setToken?: (token: string) => void
}> = ({ selectedTokens, disabledReasons, variant = 'tokenIn', setToken, onDismiss = () => null }) => {
	const tokens = useTokenStore((state) => state.tokens)
	const { onFetch, onClearFetch, onSelect: onSelectFetchedToken, fetchingToken, fetchedToken } = useFetchSearchedTokenData()
	const [search, setSearch] = useState<string>('')

	const setSearchWithTokenFetch = useCallback(
		(search: string) => {
			const searchAddr = tryGetAddress(search)?.toLowerCase()
			if (fetchingToken != null && search?.toLowerCase() !== fetchingToken) {
				onClearFetch()
			}
			if (searchAddr && tokens[searchAddr] == null && searchAddr != fetchingToken) {
				onFetch(searchAddr)
			}
			setSearch(search)
		},
		[fetchingToken, onClearFetch, onFetch, tokens]
	)

	const handleSelect = useCallback(
		(addr: string) => {
			if (setToken != null) {
				setToken(addr)
			}
			onDismiss()
		},
		[setToken, onDismiss]
	)

	const handleSelectFetchedToken = useCallback(
		(addr: string) => {
			if (addr === fetchedToken?.address) {
				onSelectFetchedToken()
			}
			if (setToken != null) {
				setToken(addr)
			}
			onDismiss()
		},
		[fetchedToken?.address, onDismiss, onSelectFetchedToken, setToken]
	)

	const filteredTokens = useMemo(() => {
		if (search == null || search === '') return Object.values(tokens)

		const searchAddr = tryGetAddress(search)?.toLowerCase()

		if (searchAddr) return Object.values(tokens).filter(({ address }) => address === searchAddr)

		const lowerSearchParts = search
			.toLowerCase()
			.split(/\s+/)
			.filter((s) => s.length > 0)

		if (lowerSearchParts.length === 0) {
			return Object.values(tokens)
		}

		const matchesSearch = ({ symbol }: { symbol: string }): boolean => {
			const sParts = symbol
				.toLowerCase()
				.split(/\s+/)
				.filter((str) => str.length > 0)

			return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)))
		}

		return Object.values(tokens).filter(matchesSearch)
	}, [search, tokens])

	const baseTokens = useMemo((): string[] => {
		return filteredTokens.filter((token) => token.base).map((token) => token.address)
	}, [])

	const sortedTokens = useMemo((): string[] => {
		const sorted = () => {
			if (variant === 'tokenIn') {
				return orderBy(filteredTokens, ['sort', 'bonus', 'userBalance'], ['asc', 'desc', 'desc'])
			}
			return filteredTokens
		}
		return sorted()
			.filter((token) => !token.base)
			.map(({ address }) => address)
	}, [variant, filteredTokens, tokens])

	return (
		<ModalContentContainer minWidth='300px' maxHeight='600px' gap='0px'>
			<SearchBar search={search} setSearch={setSearchWithTokenFetch} />
			<Row width='100%' flexWrap='wrap' gap='8px' marginY='4px'>
				{baseTokens.map((addr) => (
					<BaseTokenRow
						key={addr}
						token={tokens[addr]}
						selected={selectedTokens?.includes(addr)}
						disabledReason={disabledReasons?.[addr]}
						setToken={handleSelect}
						variant={variant}
					/>
				))}
			</Row>
			{fetchingToken == null && (
				<HeaderRow>
					<Text>Token</Text>
					<Text>{variant === 'tokenIn' ? 'Bal' : 'Price'}</Text>
				</HeaderRow>
			)}
			<Scrollable>
				{sortedTokens.map((addr) => (
					<TokenSelectRow
						key={addr}
						token={tokens[addr]}
						selected={selectedTokens?.includes(addr)}
						disabledReason={disabledReasons?.[addr]}
						setToken={handleSelect}
						variant={variant}
					/>
				))}
				{sortedTokens.length === 0 && fetchingToken == null && (
					<Text my='16px' italic small>
						No Tokens Found
					</Text>
				)}
				{fetchingToken != null && fetchedToken == null && (
					<Text my='16px' small>
						Searching for token...
					</Text>
				)}
				{fetchedToken != null && fetchingToken != null && fetchedToken.address === fetchingToken && (
					<CustomTokenSection token={fetchedToken} onSelect={handleSelectFetchedToken} />
				)}
			</Scrollable>
		</ModalContentContainer>
	)
}

export default TokenSelectModal
