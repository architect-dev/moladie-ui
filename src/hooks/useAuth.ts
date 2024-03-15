import { useCallback } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { NoBscProviderError } from '@binance-chain/bsc-connector'
import { NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect, WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { ConnectorNames, connectorLocalStorageKey } from '@uikit'
import { connectorsByName } from '@utils/web3React'
import { setupNetwork } from '@utils/wallet'
import useToast from '@hooks/useToast'

const useAuth = () => {
	const { activate, deactivate } = useWeb3React()
	const { toastError } = useToast()

	const login = useCallback(
		(connectorID: ConnectorNames) => {
			const connector = connectorsByName[connectorID]
			if (connector) {
				activate(connector, async (error: Error) => {
					if (error instanceof UnsupportedChainIdError) {
						const hasSetup = await setupNetwork()
						if (hasSetup) {
							await activate(connector)
						}
					} else {
						window.localStorage.removeItem(connectorLocalStorageKey)
						if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
							toastError('Provider Error', 'No provider was found')
						} else if (error instanceof UserRejectedRequestErrorInjected || error instanceof UserRejectedRequestErrorWalletConnect) {
							if (connector instanceof WalletConnectConnector) {
								const walletConnector = connector as WalletConnectConnector
								walletConnector.walletConnectProvider = null
							}
							toastError('Wallet Error', 'Authorization failed')
						} else {
							console.log({
								error,
							})
							toastError(error.name, error.message)
						}
					}
				})
			} else {
				toastError('Unable to find connector', 'The connector config is wrong')
			}
		},
		[activate, toastError]
	)

	const logout = useCallback(() => {
		deactivate()
		window.localStorage.removeItem(connectorLocalStorageKey)
	}, [deactivate])

	return { login, logout }
}

export default useAuth
