import { Nullable } from './types'

export const getEllipsedAddresses = (address: Nullable<string>): string | null => {
	if (address == null) return null
	return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
}
