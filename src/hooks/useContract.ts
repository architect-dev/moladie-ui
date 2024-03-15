/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import {
	getContract,
	getProviderOrSigner,
	getErc20Contract,
	getSummitRouterContract,
	getMulticallContract,
	getPermitErc20Contract,
	getSummitAdminContract,
	getWNativeContract,
} from '@utils'
import useActiveWeb3React from './useActiveWeb3React'

const useContract = (ABI: any, address: string | undefined, withSignerIfPossible = true) => {
	const { library, account } = useActiveWeb3React()

	return useMemo(() => {
		if (!address || !ABI || !library) return null
		try {
			return getContract(ABI, address, withSignerIfPossible ? (getProviderOrSigner(library, account) as any) : null)
		} catch (error) {
			console.error('Failed to get contract', error)
			return null
		}
	}, [address, ABI, library, withSignerIfPossible, account])
}

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address?: string) => {
	const { library } = useActiveWeb3React()
	return useMemo(() => (address == null ? null : getErc20Contract(address, library?.getSigner())), [library, address])
}

export function usePermitERC20(address?: string) {
	const { library } = useActiveWeb3React()
	return useMemo(() => (address == null ? null : getPermitErc20Contract(address, library?.getSigner())), [library, address])
}

export const useMulticallContract = () => {
	const { library } = useActiveWeb3React()
	return useMemo(() => getMulticallContract(library?.getSigner()), [library])
}

export const useSummitRouter = () => {
	const { library } = useActiveWeb3React()
	return useMemo(() => getSummitRouterContract(library?.getSigner()), [library])
}

export const useSummitAdmin = () => {
	const { library } = useActiveWeb3React()
	return useMemo(() => getSummitAdminContract(library?.getSigner()), [library])
}

export const useWNATIVE = () => {
	const { library } = useActiveWeb3React()
	return useMemo(() => getWNativeContract(library?.getSigner()), [library])
}

export default useContract
