import { useEffect, useState, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { simpleRpcProvider } from '@utils/providers'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { CHAIN_ID } from '@utils'
import { useAggregatorStore } from '@state/aggregator/store'
import { usePointsStore } from '@state/aggregator/points/pointsStore'

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = (): Web3ReactContextInterface<Web3Provider> => {
	const { library, chainId, ...web3React } = useWeb3React()
	const refEth = useRef(library)
	const [provider, setProvider] = useState(library || simpleRpcProvider)

	useEffect(() => {
		if (library !== refEth.current) {
			setProvider(library || simpleRpcProvider)
			refEth.current = library
		}
	}, [library])

	return { library: provider, chainId: chainId ?? parseInt(CHAIN_ID, 10), ...web3React }
}

const setActiveAccount = (account: string) => {
	useAggregatorStore.getState().setActiveAccount(account)
}
const clearActiveAccount = () => {
	useAggregatorStore.getState().clearActiveAccount()
	usePointsStore.setState({ pointsData: null, referralsData: null, referrerByCodeData: null })
}

export const useSyncAccount = () => {
	const { account } = useActiveWeb3React()
	useEffect(() => {
		if (account != null) {
			setActiveAccount(account.toLowerCase())
		} else {
			clearActiveAccount()
		}
	}, [account])
}

export default useActiveWeb3React
