import BigNumber from 'bignumber.js'
import { Nullable } from './types'

export const decOffset = (ish: BigNumberish | null, decimals: number | null = 18): number | null => {
	if (ish == null || decimals == null) return null
	return bn(ish).dividedBy(bnExp(decimals)).toNumber()
}
export const bnDecOffset = (ish: BigNumberish | undefined | null, decimals: number | null = 18): BigNumber | null => {
	if (ish == null || decimals == null) return null
	return bn(ish).dividedBy(bnExp(decimals))
}

export const bnZero = new BigNumber(0)

export type BigNumberish = BigNumber | string | number
export const bn = (toBN: BigNumberish) => new BigNumber(toBN)
export const bnExp = (decimals: number): BigNumber => {
	return new BigNumber(10).pow(decimals)
}
export const bnMax = (a: BigNumber | null, b: BigNumber | null): BigNumber | null => {
	if (a == null && b == null) return null
	if (a == null) return b
	if (b == null) return a
	return a.gt(b) ? a : b
}
export const eNbN = (ish: BigNumberish, decimals: number): BigNumber => {
	return bn(ish).times(bnExp(decimals))
}
export const eN = (ish: BigNumberish, decimals: number): string => {
	return eNbN(ish, decimals).toString()
}

export const bnDisplay = (balance: Nullable<BigNumberish>, decimals: Nullable<number>, precision = 3) => {
	if (balance == null || decimals == null) return null
	return bn(balance).dividedBy(bnExp(decimals)).toFixed(precision)
}

export const getPrecision = (n: string): Nullable<number> => {
	if (isNaN(parseFloat(n))) return null
	const decimals = n.split('.')[1]
	if (decimals) return decimals.length
	return 0
}
export const checkPrecisionValid = (n: string, decimals: number): boolean => {
	const precision = getPrecision(n)
	if (precision == null) return true
	return precision <= decimals
}
export const toFixedMaxPrecision = (n: Nullable<string>, decimals?: number): Nullable<string> => {
	if (n == null || decimals == null) return n
	const precision = getPrecision(n)
	if (precision == null || precision <= decimals) return n
	return parseFloat(n).toFixed(decimals)
}

export const calculateGasMargin = (ish: BigNumberish): BigNumber => {
	return bn(ish).times(11000).idiv(10000)
}

export const checkDecimalValidity = (ish: BigNumberish, allowedDecimals: number): boolean => {
	const decimals = (bn(ish).toString() + '.').split('.')[1].length
	return decimals <= allowedDecimals
}
