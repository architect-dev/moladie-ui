import { Call } from './callsTypes'

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
const LOWER_HEX_REGEX = /^0x[a-f0-9]*$/
export function toCallKey(call: Call): string {
	if (!ADDRESS_REGEX.test(call.address)) {
		throw new Error(`Invalid address: ${call.address}`)
	}
	if (!LOWER_HEX_REGEX.test(call.callData)) {
		throw new Error(`Invalid hex: ${call.callData}`)
	}
	return `${call.address}-${call.callData}`
}

export function parseCallKey(callKey: string): Call {
	const pcs = callKey.split('-')
	if (pcs.length !== 2) {
		throw new Error(`Invalid call key: ${callKey}`)
	}
	return {
		address: pcs[0],
		callData: pcs[1],
	}
}

// chunks array into chunks of maximum size
// evenly distributes items among the chunks
export function chunkArray<T>(items: T[], maxChunkSize: number): T[][] {
	if (maxChunkSize < 1) throw new Error('maxChunkSize must be gte 1')
	if (items.length <= maxChunkSize) return [items]

	const numChunks: number = Math.ceil(items.length / maxChunkSize)
	const chunkSize = Math.ceil(items.length / numChunks)

	return [...Array(numChunks).keys()].map((ix) => items.slice(ix * chunkSize, ix * chunkSize + chunkSize))
}
