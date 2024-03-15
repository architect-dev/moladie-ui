import type { Signer } from '@ethersproject/abstract-signer'
import type { Provider } from '@ethersproject/providers'
import ERC20ABI from '../config/abi/ERC20.json'
import ERC20_NONCES_ABI from '../config/abi/ERC20_NONCES_ABI.json'
import SummitAdapter from '../config/abi/SummitAdapter.json'
import MulticallABI from '../config/abi/Multicall.json'
import { Contract } from '@ethersproject/contracts'
import { simpleRpcProvider } from '@utils/providers'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { Nullable } from './types'
import { SummitAdmin, SummitMulticall, SummitReferrals, SummitRouter, WNATIVE } from '@config/deployments'

type SignerLike = Signer | Provider | JsonRpcSigner

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
	return library.getSigner(account).connectUnchecked()
}

// account is optional
export const getProviderOrSigner = (library: Web3Provider, account?: Nullable<string>) => {
	return account ? getSigner(library, account) : library
}

export const getContract = (abi: any, address: string, signer?: SignerLike) => {
	const signerOrProvider: any = signer ?? simpleRpcProvider
	return new Contract(address, abi, signerOrProvider)
}

export const getErc20Contract = (address: string, signer?: SignerLike) => {
	return getContract(ERC20ABI, address, signer)
}

export const getPermitErc20Contract = (address: string, signer?: SignerLike) => {
	return getContract(ERC20_NONCES_ABI, address, signer)
}

export const getMulticallContract = (signer?: SignerLike) => {
	return getContract(MulticallABI, SummitMulticall, signer)
}

export const getSummitRouterContract = (signer?: SignerLike) => {
	return getContract(SummitRouter.abi, SummitRouter.address, signer)
}

export const getSummitReferralsContract = (signer?: SignerLike) => {
	return getContract(SummitReferrals.abi, SummitReferrals.address, signer)
}

export const getSummitAdminContract = (signer?: SignerLike) => {
	return getContract(SummitAdmin.abi, SummitAdmin.address, signer)
}

export const getWNativeContract = (signer?: SignerLike) => {
	return getContract(WNATIVE.abi, WNATIVE.address, signer)
}

export const getAdapterContract = (address: string, signer?: SignerLike) => {
	return getContract(SummitAdapter.abi, address, signer)
}
