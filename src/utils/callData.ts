import { Contract } from '@ethersproject/contracts'

const getCallData = (contract: Contract, methodName: string, args: any[]) => {
	return contract.interface.encodeFunctionData(methodName, [...args])
}

export default getCallData
