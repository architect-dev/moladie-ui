/* eslint-disable no-param-reassign */
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { AddressRecord, Token } from '../types'
import { WritableDraft } from 'immer/dist/types/types-external.js'
import { TokenList, TokenListItem } from '@config/tokens'
import useRefresh from '@hooks/useRefresh'
import { useCallback, useEffect, useMemo } from 'react'
import useActiveWeb3React from '@hooks/useActiveWeb3React'
import { zeroAdd } from '@config/constants'
import { Nullable, groupBy } from '@utils'
import { fetchSearchedTokenData, fetchTokenData, fetchTokenListData } from './fetchTokenData'
import { useUserTokenStore } from './userTokenStore'
import { orderBy } from 'lodash'

interface TokenState {
	nativePrice: number | null
	// State
	tokens: AddressRecord<Token>

	// Custom Token
	fetchingSearchToken: string | null
	fetchedSearchToken: Token | null

	// Mutations
	addToken: (token: Token) => void
	fetchListTokens: (account: string) => void
	fetchTokenData: (account: string, token: string) => void
	fetchSearchedTokenData: (account: string, searchToken: string) => void
	setFetchingSearchToken: (searchToken: string | null) => void
}

type ZustandSet = (
	nextStateOrUpdater: TokenState | Partial<TokenState> | ((tokenState: WritableDraft<TokenState>) => void),
	shouldReplace?: boolean | undefined
) => void
type ZustandGet = () => TokenState

let listFetchCount = 0
const fetchAndSetListTokens = async (set: ZustandSet, get: ZustandGet, account: string) => {
	// First pass setting of initial token list data
	const tokenListAdds = Object.values(TokenList).map((item): TokenListItem => ({ ...item, address: item.address.toLowerCase() }))
	const userTokensObj = useUserTokenStore.getState().tokens
	const userTokenAdds = Object.values(userTokensObj)
	const tokenListArr: Token[] = [...userTokenAdds, ...tokenListAdds].map((tokenListItem) => ({
		...tokenListItem,
		...get().tokens[tokenListItem.address.toLowerCase()],
		bonus: 0,
		fetching: true,
	}))
	set((state) => {
		state.tokens = groupBy(tokenListArr, (item) => item.address)
	})

	// Fetch and merge into state
	const { data: tokenListObj, index: fetchIndex } = await fetchTokenListData(account, get().tokens, ++listFetchCount)
	if (tokenListObj == null || fetchIndex < listFetchCount) return
	set((state) => {
		state.tokens = tokenListObj
	})
}

export const useTokenStore = create<TokenState>()(
	immer((set, get) => ({
		nativePrice: 0.45,
		tokens: {},

		fetchingSearchToken: null,
		fetchedSearchToken: null,

		addToken: (token: Token) => {
			set((state) => {
				state.tokens[token.address] = { ...token }
			})
		},
		fetchListTokens: (account: string) => {
			fetchAndSetListTokens(set, get, account)
		},
		fetchTokenData: async (account: string, token: string) => {
			const tokenItem = get().tokens[token]
			set((state) => {
				state.tokens[token] = {
					...(state.tokens[token] ?? {}),
					fetching: true,
				}
			})
			const tokenData = await fetchTokenData(account, tokenItem)
			set((state) => {
				state.tokens[token] = {
					...(state.tokens[token] ?? {}),
					...tokenData,
				}
			})
		},
		fetchSearchedTokenData: async (account: string, searchToken: string) => {
			set({ fetchingSearchToken: searchToken })
			const tokenData = await fetchSearchedTokenData(account, searchToken)

			if (tokenData != null && searchToken === tokenData.address) {
				set({ fetchedSearchToken: tokenData })
			}
		},
		setFetchingSearchToken: (searchToken: string | null) => {
			set({ fetchingSearchToken: searchToken })
		},
	}))
)

export const useFetchTokenListData = () => {
	const { slowRefresh } = useRefresh()
	const { account } = useActiveWeb3React()

	useEffect(() => {
		useTokenStore.getState().fetchListTokens(account ?? zeroAdd)
	}, [account, slowRefresh])
}

export const useTokenData = (tokenAdd: Nullable<string>) => {
	return useTokenStore((state) => (tokenAdd != null ? state.tokens[tokenAdd] : null))
}

export const useFetchSearchedTokenData = () => {
	const { account } = useActiveWeb3React()
	const fetchingToken = useTokenStore((state) => state.fetchingSearchToken)
	const fetchedToken = useTokenStore((state) => state.fetchedSearchToken)

	const onFetch = useCallback(
		(searchToken: string) => {
			useTokenStore.getState().fetchSearchedTokenData(account ?? zeroAdd, searchToken)
		},
		[account]
	)

	const onClearFetch = useCallback(() => {
		useTokenStore.getState().setFetchingSearchToken(null)
	}, [])

	const onSelect = useCallback(() => {
		if (fetchedToken == null) return
		useTokenStore.getState().addToken(fetchedToken)
		useTokenStore.setState({ fetchingSearchToken: null, fetchedSearchToken: null })
		useUserTokenStore.getState().addToken(fetchedToken)
	}, [fetchedToken])

	return { onFetch, onClearFetch, onSelect, fetchingToken, fetchedToken }
}

export const useTokensWithBalanceUSD = () => {
	const tokens = useTokenStore((state) => state.tokens)

	return useMemo((): Token[] => {
		const tokensWithBalance = Object.values(tokens).filter((token) => (token.userBalanceUSD ?? 0) > 0)
		return orderBy(tokensWithBalance, ['userBalanceUSD'], ['desc'])
	}, [tokens])
}
