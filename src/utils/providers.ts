import { StaticJsonRpcProvider } from '@ethersproject/providers'
import getRpcUrl from './getRpcUrl'

const RPC_URL = getRpcUrl()

export const simpleRpcProvider = new StaticJsonRpcProvider(RPC_URL)

export default null