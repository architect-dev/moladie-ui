import { Token } from '@state/aggregator/types'
import { CHAIN_ID } from '@utils'

export const getPermitEIP712Domain = (permit: number): { name: string; type: string }[] | null => {
	switch (permit) {
		case 1:
		case 1000:
		case 1001:
			return [
				{ name: 'name', type: 'string' },
				{ name: 'version', type: 'string' },
				{ name: 'chainId', type: 'uint256' },
				{ name: 'verifyingContract', type: 'address' },
			]
		case 2:
			return [
				{ name: 'chainId', type: 'uint256' },
				{ name: 'verifyingContract', type: 'address' },
			]
		default:
			return null
	}
}

export const getTokenDomainData = (
	token: Token,
	name: string | undefined,
	symbol: string | undefined
): { name?: string; version?: string; chainId: number; verifyingContract: string } | null => {
	const version = '1'
	const chainId = parseInt(CHAIN_ID)
	switch (token.permit) {
		case 1:
			return {
				name,
				version,
				chainId,
				verifyingContract: token.address,
			}
		case 1000:
			return {
				name: '',
				version,
				chainId,
				verifyingContract: token.address,
			}
		case 1001:
			return {
				name: symbol,
				version,
				chainId,
				verifyingContract: token.address,
			}
		case 2:
			return {
				chainId,
				verifyingContract: token.address,
			}
		case 0:
		default:
			return null
	}
}
