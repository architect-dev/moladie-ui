import { TokenListItem } from '@config/tokens'
import { Nullable } from '@utils'
import BigNumber from 'bignumber.js'

export type AddressRecord<T> = Record<string, T>

export enum GasSetting {
	default = 0,
	fast = 1,
	instant = 2,
}

// ECOSYSTEM

export type RoutePriorityType = 'least-gas' | 'output-amount'
export interface Ecosystem {
	account: Nullable<string>
	isDark: boolean
	connectModalOpen: boolean

	// USER SETTINGS
	slippage: number
	infApprovals: boolean
	infPermits: boolean
	gasSetting: GasSetting
	routePriority: RoutePriorityType
}
interface EcosystemMutators {
	setActiveAccount: (account: string) => void
	clearActiveAccount: () => void
	setIsDark: (dark: boolean) => void
	setSlippage: (slippage: number) => void
	setConnectModalOpen: (open: boolean) => void
	setInfApprovals: (infApprovals: boolean) => void
	setInfPermits: (infPermits: boolean) => void
	setGasSetting: (gasSetting: GasSetting) => void
	setRoutePriority: (routePriority: RoutePriorityType) => void
}

// PUBLIC DATA
export interface Token extends TokenListItem {
	address: string
	decimals: number
	bonus: number
	fetching: boolean
	price?: number
	userBalance?: BigNumber
	userBalanceUSD?: number
	permit?: 0 | 1 | 1000 | 1001 | 2
	isUserAdded?: boolean
}

// USER DATA
export interface UserTx {
	timestamp: number
	hash: string
	tokenIn: string
	tokenInAmount: string
	tokenOut: string
	tokenOutAmount: string
	pointsEarned: string
}

// SWAP DATA
export interface SwapTradeData {
	isNativeIn: boolean
	isNativeOut: boolean
	isPermit: boolean
	isWrapOrUnwrap: boolean
	routePriority: RoutePriorityType
}
export interface SwapData {
	valid: boolean
	invalidReason: string
	tokenIn: string
	tokenOut: string
	tokenInAmount: string
	tokenInAllowance: string
	tokenOutAmount: string
	adapters: string[]
	amounts: string[]
	path: string[]
	gasEstimate: string
	trade: SwapTradeData
}
export interface SwapDataState {
	swapData?: SwapData
	swapDataDirty: boolean
	swapDataFetching: boolean
	tokenDataFetching: boolean
}
export interface SwapDataMutators {
	setSwapData: (swapData: SwapData | undefined) => void
}

// UI DATA
export interface UIData {
	independentToken: 'in' | 'out'
	tokenIn?: string
	tokenInAmount?: string
	tokenInError?: string
	tokenInData?: {
		price?: string
		userBalance?: string
	}
	tokenOut?: string
	tokenOutAmount?: string
	tokenOutData?: {
		price?: string
		userBalance?: string
	}
}
export interface UIDataMutators {
	setTokenIn: (tokenIn?: string) => void
	setTokenInAmount: (tokenInAmount?: string) => void
	setTokenOut: (tokenOut?: string) => void
	setTokenOutAmount: (tokenOutAmount?: string) => void
	setIndependentToken: (independent: 'in' | 'out') => void

	swapTokens: () => void
	refreshSwap: () => void
}

// ADAPTERS
export interface AdapterData {
	address: string
	name: string
}

// LOADED
interface Loaded {}

export interface State extends Ecosystem, EcosystemMutators, SwapDataState, SwapDataMutators, UIData, UIDataMutators, Loaded {}
