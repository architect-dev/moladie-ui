import BigNumber from 'bignumber.js'
import { useMulticallContract } from './useContract'
import { useSingleCallResult } from '@state/aggregator/calls/callsHooks'
import { bn } from '@utils'

// gets the current timestamp from the blockchain
export default function useCurrentBlockTimestamp(): BigNumber | undefined {
	const multicall = useMulticallContract()
	const timestamp = useSingleCallResult(multicall, 'getCurrentBlockTimestamp')?.result?.[0]
	return timestamp != null ? bn(timestamp.toString()) : undefined
}
