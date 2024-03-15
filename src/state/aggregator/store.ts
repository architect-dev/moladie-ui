/* eslint-disable no-param-reassign */
import { CHAIN_ID, bn, checkDecimalValidity } from '@utils'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { GasSetting, State, SwapData, SwapTradeData } from './types'
import fetchSwapData from './fetchSwapData'
import { WritableDraft } from 'immer/dist/types/types-external.js'
import { useTokenData, useTokenStore } from './tokens/tokenStore'
import { zeroAdd } from '@config/constants'
import useRefresh from '@hooks/useRefresh'
import { useEffect, useRef } from 'react'
import { WNATIVE } from '@config/deployments'
import { dbg } from './debug/debugStore'

type ZustandSet = (nextStateOrUpdater: State | Partial<State> | ((state: WritableDraft<State>) => void), shouldReplace?: boolean | undefined) => void
type ZustandGet = () => State

const validateTokenInAmount = async (set: ZustandSet, get: ZustandGet) => {
	const { tokenIn, tokenInAmount } = get()
	if (tokenIn == null || tokenInAmount == null || tokenInAmount === '') {
		set({ tokenInError: undefined })
		return
	}
	if (isNaN(parseFloat(tokenInAmount))) {
		set({ tokenInError: 'Invalid amount' })
		return
	}
	if (parseFloat(tokenInAmount) === 0) {
		set({ tokenInError: 'Must be > 0' })
		return
	}
	set({ tokenInError: undefined })
}

// swapNoSplit
// swapNoSplitFromNATIVE
// swapNoSplitToNATIVE
// swapNoSplitWithPermit
// swapNoSplitToNATIVEWithPermit

// Base swap data
// 		Trade calldata _trade
// 		address _to
// 		uint256 _fee

// Permit swap data
// 		uint256 _deadline
// 		uint8 _v
// 		bytes32 _r
// 		bytes32 _s

const isNativeOrWNative = (address: string) => {
	return address === zeroAdd || address === WNATIVE.address
}

const getIsWrap = (tokenInAdd: string, tokenOutAdd: string) => {
	return isNativeOrWNative(tokenInAdd) && isNativeOrWNative(tokenOutAdd)
}

const fetchAndSetSwapData = async () => {
	const { account, tokenIn: tokenInAdd, tokenOut: tokenOutAdd, tokenInAmount, routePriority } = useAggregatorStore.getState()
	const tokens = useTokenStore.getState().tokens

	if (tokenInAdd == null || tokenOutAdd == null) return
	const swapTradeData: SwapTradeData = {
		isPermit: false,
		isNativeIn: tokenInAdd === zeroAdd,
		isNativeOut: tokenOutAdd === zeroAdd,
		isWrapOrUnwrap: getIsWrap(tokenInAdd, tokenOutAdd),
		routePriority,
	}

	const tokenIn = tokenInAdd // tokenInRaw === zeroAdd ? WNATIVE : tokenInRaw
	const tokenOut = tokenOutAdd // tokenOutRaw === zeroAdd ? WNATIVE : tokenOutRaw
	const tokenInItem = tokens[tokenIn]
	const tokenOutItem = tokens[tokenOut]

	if (tokenInAmount != null && tokenInAmount !== '' && account != null && tokenInItem != null && tokenOutItem != null && tokenInAmount != null) {
		useAggregatorStore.setState({ swapDataFetching: true, tokenDataFetching: true })
		const swapDataRes = await fetchSwapData({
			account,
			tokenInAmount,
			tokenInItem,
			tokenOutItem,
			maxHops: 2,
			tradeData: swapTradeData,
		})
		if (swapDataRes == null) {
			useAggregatorStore.setState({
				swapData: undefined,
				swapDataFetching: false,
				tokenDataFetching: false,
				swapDataDirty: false,
			})
			return
		}
		const { swapData, tokenIn, tokenOut } = swapDataRes
		const swapStillCurrent = swapData?.tokenIn === tokenInAdd
		useAggregatorStore.setState({
			swapData: swapStillCurrent ? swapData : undefined,
			swapDataFetching: false,
			swapDataDirty: false,
			tokenDataFetching: false,
		})
		useTokenStore.setState((state) => {
			state.tokens[tokenIn.address] = tokenIn
			state.tokens[tokenOut.address] = tokenOut
		})
	}
}

export const useAggregatorStore = create<State>()(
	persist(
		immer((set, get) => ({
			// ECOSYSTEM
			account: null,
			isDark: false,
			connectModalOpen: false,
			slippage: 50,
			infApprovals: true,
			infPermits: false,
			routePriority: 'least-gas',
			gasSetting: GasSetting.default,
			setActiveAccount: (account: string) => set({ account }),
			clearActiveAccount: () => set({ account: null }),
			setIsDark: (isDark) => set({ isDark }),
			setSlippage: (slippage: number) => set({ slippage }),
			setConnectModalOpen: (connectModalOpen) => set({ connectModalOpen }),
			setInfApprovals: (infApprovals: boolean) => set({ infApprovals }),
			setInfPermits: (infPermits: boolean) => set({ infPermits }),
			setGasSetting: (gasSetting: GasSetting) => set({ gasSetting }),
			setRoutePriority: (routePriority) => set({ routePriority }),

			// UI DATA
			independentToken: 'in',
			tokenIn: '0x0000000000000000000000000000000000000000',
			tokenInAmount: undefined,
			tokenInData: undefined,
			tokenInError: undefined,
			tokenOut: '0x4300000000000000000000000000000000000003',
			tokenOutAmount: undefined,
			tokenOutData: undefined,
			setTokenIn: async (tokenIn?: string) => {
				set({ tokenIn, tokenInAmount: undefined, swapData: undefined, swapDataFetching: false, swapDataDirty: true })
				validateTokenInAmount(set, get)
				fetchAndSetSwapData()
			},
			setTokenInAmount: async (tokenInAmount?: string) => {
				// Escape if tokenOut persists
				if (tokenInAmount === get().tokenInAmount) return
				set({ tokenInAmount, swapDataDirty: true })
				if (tokenInAmount == null || tokenInAmount === '') {
					set({ swapDataFetching: false, tokenDataFetching: false, swapData: undefined, swapDataDirty: false })
				}
				validateTokenInAmount(set, get)
				fetchAndSetSwapData()
			},
			setTokenOut: async (tokenOut?: string) => {
				// Escape if tokenOut persists
				if (tokenOut === get().tokenOut) return
				set({ tokenOut, swapDataDirty: true })
				fetchAndSetSwapData()
			},
			setTokenOutAmount: (tokenOutAmount?: string) => {
				set({ tokenOutAmount })
			},
			setIndependentToken: (independentToken: 'in' | 'out') => {
				set({ independentToken })
			},

			swapTokens: () => {
				const { tokenIn, tokenInData, tokenOut, tokenOutAmount, tokenOutData } = get()
				set((state) => {
					state.tokenIn = tokenOut
					state.tokenInAmount = tokenOutAmount
					state.tokenInData = tokenOutData
					state.tokenOut = tokenIn
					state.tokenOutAmount = undefined
					state.tokenOutData = tokenInData
					state.swapDataDirty = true
				})
				validateTokenInAmount(set, get)
				fetchAndSetSwapData()
			},
			refreshSwap: async () => {
				fetchAndSetSwapData()
			},

			// SWAP DATA
			swapData: undefined,
			swapDataFetching: false,
			swapDataDirty: false,
			tokenDataFetching: false,
			setSwapData: (swapData: SwapData | undefined) => {
				set({
					swapData,
					swapDataFetching: false,
					swapDataDirty: false,
				})
			},
		})),
		{
			name: `summit_aggregator_${CHAIN_ID}`,
		}
	)
)

// HOOKS
export const useTokenInValidity = (): { valid: boolean; reason: string } => {
	const tokenIn = useAggregatorStore((state) => state.tokenIn)
	const tokenInAmount = useAggregatorStore((state) => state.tokenInAmount)
	const tokenInData = useTokenData(tokenIn)

	if (tokenIn == null || tokenInAmount == null || tokenInAmount === '') return { valid: true, reason: '' }
	if (tokenInData == null) return { valid: false, reason: 'Missing Token In Data' }
	if (isNaN(parseFloat(tokenInAmount))) return { valid: false, reason: 'Invalid number' }
	if (parseFloat(tokenInAmount) < 0) return { valid: false, reason: 'Must be non negative' }
	if (parseFloat(tokenInAmount) === 0) return { valid: false, reason: 'Must be > 0' }
	if (!checkDecimalValidity(tokenInAmount, tokenInData.decimals)) return { valid: false, reason: `Token only supports ${tokenInData.decimals} decimals` }
	if ((tokenInData.userBalance ?? 0) < parseFloat(tokenInAmount)) return { valid: false, reason: 'Insufficient balance' }
	return { valid: true, reason: '' }
}
export const useSwapValidity = (): { valid: boolean; reason: string } => {
	const swapData = useAggregatorStore((state) => state.swapData)
	const swapDataDirty = useAggregatorStore((state) => state.swapDataDirty)
	const tokenInValidity = useTokenInValidity()

	if (tokenInValidity.valid === false) return tokenInValidity
	if (swapData == null || swapDataDirty) {
		return { valid: false, reason: '' }
	}
	if (!swapData.valid) {
		return { valid: false, reason: 'No Swap Route Found' }
	}
	return { valid: true, reason: '' }
}

const priceImpactNull = { priceImpact: null, taxPerc: null }
export const useSwapPriceImpact = () => {
	const swapDataDirty = useAggregatorStore((state) => state.swapDataDirty)
	const swapData = useAggregatorStore((state) => state.swapData)
	const tokens = useTokenStore((state) => state.tokens)
	if (swapDataDirty || swapData == null || swapData.valid === false || tokens == null) return priceImpactNull

	const tokenInData = tokens[swapData.tokenIn]
	const tokenOutData = tokens[swapData.tokenOut]

	if (tokenInData?.price == null || tokenOutData?.price == null) return priceImpactNull

	const taxPerc = 100 * (1 - ((10000 - (tokenInData.tax ?? 0)) * (10000 - (tokenOutData.tax ?? 0))) / (10000 * 10000))

	const tokenInAmountUsd = bn(swapData.tokenInAmount).times(tokenInData.price)
	const tokenInAmountUsdAfterTax =
		tokenInData.tax != null || tokenOutData.tax != null
			? tokenInAmountUsd
					.times(10000 - (tokenInData.tax ?? 0))
					.times(10000 - (tokenOutData.tax ?? 0))
					.div(10000 * 10000)
			: null
	const trueTokenInAmountUsd = tokenInAmountUsdAfterTax ?? tokenInAmountUsd

	const tokenOutAmountUsd = bn(swapData.tokenOutAmount).times(tokenOutData.price)

	const priceImpact = bn(1).minus(tokenOutAmountUsd.div(trueTokenInAmountUsd)).times(100).toFixed(3)

	return { priceImpact, taxPerc }
}
export const useSwapMinReceived = () => {
	const swapDataDirty = useAggregatorStore((state) => state.swapDataDirty)
	const swapData = useAggregatorStore((state) => state.swapData)
	const slippage = useAggregatorStore((state) => state.slippage)
	if (swapDataDirty || swapData == null || swapData.valid === false) return null

	if (swapData?.trade.isWrapOrUnwrap) {
		return swapData.tokenInAmount
	}

	return bn(swapData.tokenOutAmount)
		.times(10000 - slippage)
		.div(10000)
		.toJSON()
}

export const useSwapDataRefresher = () => {
	const swapDataValid = useAggregatorStore((state) => state.swapData?.valid)
	const swapDataIsWrap = useAggregatorStore((state) => state.swapData?.trade?.isWrapOrUnwrap)
	const { fastRefresh } = useRefresh()

	useEffect(() => {
		// Dont refresh invalid swap
		if (!swapDataValid) return

		// Dont refresh if swap data is wrap, no reason to
		if (swapDataIsWrap) return

		fetchAndSetSwapData()
	}, [fastRefresh, swapDataIsWrap, swapDataValid])
}

export const useSwapDataOnPageLoad = () => {
	const account = useAggregatorStore((state) => state.account)
	const pageLoadFetched = useRef(false)

	useEffect(() => {
		if (account == null) return
		if (pageLoadFetched.current) return

		pageLoadFetched.current = true
		dbg.log('Fetching swap data on page load')
		fetchAndSetSwapData()
	}, [account])
}
