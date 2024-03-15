import { RevertError } from '@utils/estimateGas'
// @ts-expect-error Types are currently broken
import { getParsedEthersError } from '@enzoferey/ethers-error-parser'
import { dbg } from '@state/aggregator/debug/debugStore'

export const parseError = (error: RevertError) => {
	return getParsedEthersError(error) as {
		errorCode: string
		context?: string
	}
}

export const parseAndSetError = (setError: (err: string) => void, fn?: string) => {
	return (error: RevertError) => {
		const parsed = parseError(error)
		dbg.error(`Estimating gas failed${fn != null ? ` ${fn}` : ''}:`, `${parsed.errorCode} : ${parsed.context}`, error)
		setError(`${parsed.errorCode} : ${parsed.context}`)
	}
}
