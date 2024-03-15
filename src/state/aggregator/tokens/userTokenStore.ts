/* eslint-disable no-param-reassign */
import { CHAIN_ID } from '@utils'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { AddressRecord } from '../types'
import { TokenListItem } from '@config/tokens'

type State = {
	tokens: AddressRecord<TokenListItem>
	addToken: (token: TokenListItem) => void
}

export const useUserTokenStore = create<State>()(
	persist(
		immer((set) => ({
			tokens: {},
			addToken: ({ address, decimals, symbol }: TokenListItem) => {
				set((state) => {
					state.tokens[address] = { address, decimals, symbol }
				})
			},
		})),
		{
			name: `summit_aggregator_user_tokens_${CHAIN_ID}`,
		}
	)
)
