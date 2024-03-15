/* eslint-disable no-param-reassign */
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { CHAIN_ID, bn, checkDecimalValidity } from '@utils'
import { persist } from 'zustand/middleware'
import { DCAState } from './dcaTypes'
import { useTokenData } from '../tokens/tokenStore'

export const weights: Record<number, number[]> = {
	0: [100],
	1: [100],
	2: [56, 44],
	3: [42, 33, 25],
	4: [36, 28, 21, 15],
	5: [33, 25, 19, 13, 10],
	6: [31, 24, 18, 12, 9, 6],
	7: [30, 23, 17, 11, 8, 6, 5],
	8: [30, 22, 16, 12, 8, 5, 4, 3],
}
export const getWeights = (n: number) => weights[n]

export const useDCAStore = create<DCAState>()(
	persist(
		immer((set, get) => ({
			dcaSlippage: 100,

			tokenIn: null,
			tokenInAmount: null,
			tokenInAmountType: 'spread',
			tokensOut: [],
			tokensOutWeights: [],
			recurrence: 'day',
			recurrenceTimes: 1,
			orderCount: 2,

			setTokenIn: (tokenIn) => {
				set({ tokenIn })
			},
			setTokenInAmount: (tokenInAmount) => {
				set({ tokenInAmount })
			},
			setTokenInAmountType: (type) => {
				set({ tokenInAmountType: type })
			},

			addTokenOut: (token: string) => {
				const weights = get().tokensOutWeights
				if (weights.length === 0) {
					set({ tokensOut: [token], tokensOutWeights: [100] })
					return
				}
				const finalTokensWeight = weights[weights.length - 1] / 2
				const updatedWeights = [...weights, 0].map((weight, i) => (i < weights.length - 1 ? weight : finalTokensWeight))
				set({ tokensOut: [...get().tokensOut, token], tokensOutWeights: updatedWeights })
			},
			removeTokenOut: (token: string) => {
				const length = get().tokensOut.length
				set({
					tokensOut: get().tokensOut.filter((tokenOut) => tokenOut !== token),
					tokensOutWeights: length === 1 ? [] : getWeights(length - 1),
				})
			},
			shuffleTokenOuts: (order: string[]) => {
				console.log('shuffle DCA tokens', order)
			},
			updateTokenOutWeights: (weights: number[]) => {
				set({ tokensOutWeights: weights })
			},

			setRecurrence: (recurrence) => {
				set({ recurrence })
			},
			setRecurrenceTimes: (recurrenceTimes: number) => {
				set({ recurrenceTimes })
			},
			setOrderCount: (orderCount) => {
				set({ orderCount })
			},
			rebalanceTokensOutWeights: (rebalanceOption) => {
				console.log('rebalance with option', rebalanceOption)
			},
		})),
		{
			name: `summit_aggregator_dca_${CHAIN_ID}`,
		}
	)
)

export const useDCATokenInValidity = (): { valid: boolean; reason: string } => {
	const tokenIn = useDCAStore((state) => state.tokenIn)
	const tokenInAmount = useDCAStore((state) => state.tokenInAmount)
	const tokenInData = useTokenData(tokenIn)

	if (tokenIn == null || tokenInAmount == null || tokenInAmount === '') return { valid: true, reason: '' }
	if (tokenInData == null) return { valid: false, reason: 'Missing Token In Data' }
	if (isNaN(parseFloat(tokenInAmount))) return { valid: false, reason: 'Invalid number' }
	if (parseFloat(tokenInAmount) < 0) return { valid: false, reason: 'Must be non negative' }
	if (parseFloat(tokenInAmount) === 0) return { valid: false, reason: 'Must be > 0' }
	if (!checkDecimalValidity(tokenInAmount, tokenInData.decimals)) return { valid: false, reason: `Token only supports ${tokenInData.decimals} decimals` }
	if ((tokenInData.userBalance ?? bn('0')).lt(tokenInAmount)) return { valid: false, reason: 'Insufficient balance' }
	return { valid: true, reason: '' }
}
