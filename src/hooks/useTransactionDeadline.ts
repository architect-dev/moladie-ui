import { useMemo } from 'react'
import useCurrentBlockTimestamp from './useCurrentBlockTimestamp'
import BigNumber from 'bignumber.js'

export const DEFAULT_DEADLINE_FROM_NOW = 60 * 120

// combines the block timestamp with the user setting to give the deadline that should be used for any submitted transaction
export default function useTransactionDeadline(): BigNumber | undefined {
	const blockTimestamp = useCurrentBlockTimestamp()
	return useMemo(() => {
		if (blockTimestamp && DEFAULT_DEADLINE_FROM_NOW) return blockTimestamp.plus(DEFAULT_DEADLINE_FROM_NOW)
		return undefined
	}, [blockTimestamp])
}
