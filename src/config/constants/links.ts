import { CHAIN_ID } from './networks'

const bscTestnetLinks: ExternalLinks = {
	etherscan: 'https://testnet.bscscan.com',
}
const ftmLinks: ExternalLinks = {
	etherscan: 'https://ftmscan.com/',
}
const polygonLinks: ExternalLinks = {
	etherscan: 'https://polygonscan.com/',
}
const blastTestLinks: ExternalLinks = {
	etherscan: 'https://testnet.blastscan.io/',
}
const blastLinks: ExternalLinks = {
	etherscan: 'https://blastexplorer.io/',
}

export interface ExternalLinks {
	etherscan: string
}

const chainLinks: Record<string, ExternalLinks> = {
	56: ftmLinks, // TODO: Update this to correct values
	97: bscTestnetLinks,
	250: ftmLinks,
	137: polygonLinks,
	81457: blastLinks,
	168587773: blastTestLinks,
}

export const getLinks = (): ExternalLinks => {
	return chainLinks[CHAIN_ID]
}

export const getXScanLink = (data: string, type: 'transaction' | 'token' | 'address'): string => {
	const prefix = Boolean(CHAIN_ID) && chainLinks[Number(CHAIN_ID)].etherscan

	switch (type) {
		case 'transaction': {
			return `${prefix}/tx/${data}`
		}
		case 'token': {
			return `${prefix}/token/${data}`
		}
		case 'address':
		default: {
			return `${prefix}/address/${data}`
		}
	}
}
