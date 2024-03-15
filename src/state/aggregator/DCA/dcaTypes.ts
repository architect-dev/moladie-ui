import { Nullable } from '@utils'

export type DCARecurrenceOption = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month'
export const DCARecurrenceOptions: DCARecurrenceOption[] = ['second', 'minute', 'hour', 'day', 'week', 'month']
export type DCATokenInAmountType = 'each' | 'spread'
export const DCATokenInAmountTypes: DCATokenInAmountType[] = ['each', 'spread']
export type DCATokenOutsRebalanceOption = 'exp' | 'fib' | 'eq'
export interface DCAData {
	// USER SETTINGS
	dcaSlippage: number

	// DCA
	tokenIn: Nullable<string>
	tokenInAmount: Nullable<string>
	tokenInAmountType: DCATokenInAmountType
	tokensOut: string[]
	tokensOutWeights: number[]
	recurrence: DCARecurrenceOption
	recurrenceTimes: number
	orderCount: number
}

export interface DCAMutators {
	setTokenIn: (tokenIn: Nullable<string>) => void
	setTokenInAmount: (tokenInAmount: Nullable<string>) => void
	setTokenInAmountType: (type: DCATokenInAmountType) => void
	addTokenOut: (token: string) => void
	removeTokenOut: (token: string) => void
	shuffleTokenOuts: (order: string[]) => void
	updateTokenOutWeights: (weights: number[]) => void
	setRecurrence: (recurrence: DCARecurrenceOption) => void
	setRecurrenceTimes: (recurrenceTimes: number) => void
	setOrderCount: (orderCount: number) => void
	rebalanceTokensOutWeights: (rebalanceOption: DCATokenOutsRebalanceOption) => void
}

export interface DCAState extends DCAData, DCAMutators {}
