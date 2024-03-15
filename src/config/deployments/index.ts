const CHAIN_ID = 0

// FANTOM
import MulticallFantom from './fantom/Multicall.json'
import WNATIVEFantom from './fantom/WNATIVE.json'
import SummitRouterFantomArtifact from './fantom/SummitRouter.json'
import SummitPointsFantomArtifact from './fantom/SummitPoints.json'
import SummitReferralsFantomArtifact from './fantom/SummitReferrals.json'
import DeployedAddressesFantomRaw from './fantom/DeployedAddresses.json'
const DeployedAddressesFantom = DeployedAddressesFantomRaw as Record<string, string>

// BLAST-TEST
import MulticallBlastTest from './blast-test/Multicall.json'
import WNATIVEBlastTest from './blast-test/WNATIVE.json'
import SummitRouterBlastTestArtifact from './blast-test/SummitRouter.json'
import SummitPointsBlastTestArtifact from './blast-test/SummitPoints.json'
import SummitReferralsBlastTestArtifact from './blast-test/SummitReferrals.json'
import DeployedAddressesBlastTestRaw from './blast-test/DeployedAddresses.json'
const DeployedAddressesBlastTest = DeployedAddressesBlastTestRaw as Record<string, string>

// BLAST
import MulticallBlast from './blast/Multicall.json'
import WNATIVEBlast from './blast/WNATIVE.json'
import SummitPointsBlastArtifact from './blast/SummitPoints.json'
import SummitReferralsBlastArtifact from './blast/SummitReferrals.json'
import SummitRouterBlastArtifact from './blast/SummitRouter.json'
import SummitOracleV3BlastArtifact from './blast/SummitOracleV3.json'
import SummitAdminBlastArtifact from './blast/SummitAdmin.json'
import DeployedAddressesBlastRaw from './blast/DeployedAddresses.json'
const DeployedAddressesBlast = DeployedAddressesBlastRaw as Record<string, string>

import { AdapterData } from '@state/aggregator/types'

const SummitRouterChain: Record<number, { address: string; abi: any }> = {
	[250]: {
		address: DeployedAddressesFantom['SummitRouter'],
		abi: SummitRouterFantomArtifact.abi,
	},
	[168587773]: {
		address: DeployedAddressesBlastTest['SummitRouter'],
		abi: SummitRouterBlastTestArtifact.abi,
	},
	[81457]: {
		address: DeployedAddressesBlast['SummitRouter'],
		abi: SummitRouterBlastArtifact.abi,
	},
}
const SummitOracleV3Chain: Record<number, { address: string; abi: any }> = {
	[81457]: {
		address: DeployedAddressesBlast['SummitOracleV3'],
		abi: SummitOracleV3BlastArtifact.abi,
	},
}
const SummitPointsChain: Record<number, { address: string; abi: any }> = {
	[250]: {
		address: DeployedAddressesFantom['SummitPoints'],
		abi: SummitPointsFantomArtifact.abi,
	},
	[168587773]: {
		address: DeployedAddressesBlastTest['SummitPoints'],
		abi: SummitPointsBlastTestArtifact.abi,
	},
	[81457]: {
		address: DeployedAddressesBlast['SummitPoints'],
		abi: SummitPointsBlastArtifact.abi,
	},
}
const SummitReferralsChain: Record<number, { address: string; abi: any }> = {
	[250]: {
		address: DeployedAddressesFantom['SummitReferrals'],
		abi: SummitReferralsFantomArtifact.abi,
	},
	[168587773]: {
		address: DeployedAddressesBlastTest['SummitReferrals'],
		abi: SummitReferralsBlastTestArtifact.abi,
	},
	[81457]: {
		address: DeployedAddressesBlast['SummitReferrals'],
		abi: SummitReferralsBlastArtifact.abi,
	},
}

const SummitAdminChain: Record<number, { address: string; abi: any }> = {
	[81457]: {
		address: DeployedAddressesBlast['SummitAdmin'],
		abi: SummitAdminBlastArtifact.abi,
	},
}

const SummitAdaptersChain: Record<number, Record<string, AdapterData>> = {
	[250]: {
		[DeployedAddressesFantom['SpookySwapAdapter'].toLowerCase()]: {
			address: DeployedAddressesFantom['SpookySwapAdapter'].toLowerCase(),
			name: 'SpookySwap',
		},
		[DeployedAddressesFantom['SummitRouter'].toLowerCase()]: {
			address: DeployedAddressesFantom['SummitRouter'].toLowerCase(),
			name: 'SpiritSwap',
		},
		// [BeethovenxAdapterFantom.address.toLowerCase()]: {
		// 	address: BeethovenxAdapterFantom.address.toLowerCase(),
		// 	name: (BeethovenxAdapterFantom.args[0] as string).replace('Adapter', ''),
		// },
	},
	[168587773]: {
		[DeployedAddressesBlastTest['BlasterSwapAdapter'].toLowerCase()]: {
			address: DeployedAddressesBlastTest['BlasterSwapAdapter'].toLowerCase(),
			name: 'BlasterSwap',
		},
	},
	[81457]: {
		[DeployedAddressesBlast['ThrusterV3Adapter']]: {
			address: DeployedAddressesBlast['ThrusterV3Adapter'],
			name: 'ThrusterV3',
		},
		[DeployedAddressesBlast['MonoswapV3Adapter']]: {
			address: DeployedAddressesBlast['MonoswapV3Adapter'],
			name: 'Monoswap V3',
		},
		[DeployedAddressesBlast['CyberBlastV3Adapter']]: {
			address: DeployedAddressesBlast['CyberBlastV3Adapter'],
			name: 'CyberBlastV3',
		},
		[DeployedAddressesBlast['BitconnectV2Adapter']]: {
			address: DeployedAddressesBlast['BitconnectV2Adapter'],
			name: 'BitconnectV2',
		},
		[DeployedAddressesBlast['BlasterSwapV2Adapter']]: {
			address: DeployedAddressesBlast['BlasterSwapV2Adapter'],
			name: 'BlasterSwapV2',
		},
		[DeployedAddressesBlast['CyberBlastV2Adapter']]: {
			address: DeployedAddressesBlast['CyberBlastV2Adapter'],
			name: 'CyberBlastV2',
		},
		[DeployedAddressesBlast['DYORSwapV2Adapter']]: {
			address: DeployedAddressesBlast['DYORSwapV2Adapter'],
			name: 'DYORSwap V2',
		},
		[DeployedAddressesBlast['Thruster10FeeV2Adapter']]: {
			address: DeployedAddressesBlast['Thruster10FeeV2Adapter'],
			name: 'ThrusterV2 (1% fee)',
		},
		[DeployedAddressesBlast['Thruster3FeeV2Adapter']]: {
			address: DeployedAddressesBlast['Thruster3FeeV2Adapter'],
			name: 'ThrusterV2 (0.3% fee)',
		},
		[DeployedAddressesBlast['HyperBlastV2Adapter']]: {
			address: DeployedAddressesBlast['HyperBlastV2Adapter'],
			name: 'HyperBlastV2',
		},
		[DeployedAddressesBlast['MonoswapV2Adapter']]: {
			address: DeployedAddressesBlast['MonoswapV2Adapter'],
			name: 'MonoswapV2',
		},
	},
}
const WNATIVEChain: Record<number, { address: string; abi: any }> = {
	[250]: WNATIVEFantom,
	[168587773]: WNATIVEBlastTest,
	[81457]: WNATIVEBlast,
}
const MulticallChain: Record<number, string> = {
	[250]: MulticallFantom.address.toLowerCase(),
	[168587773]: MulticallBlastTest.address.toLowerCase(),
	[81457]: MulticallBlast.address.toLowerCase(),
}

export const SummitRouter = SummitRouterChain[CHAIN_ID]
export const SummitOracleV2 = SummitOracleV3Chain[CHAIN_ID]
export const SummitPoints = SummitPointsChain[CHAIN_ID]
export const SummitReferrals = SummitReferralsChain[CHAIN_ID]
export const SummitAdmin = SummitAdminChain[CHAIN_ID]
export const SummitAdapters = SummitAdaptersChain[CHAIN_ID]
export const WNATIVE = WNATIVEChain[CHAIN_ID]
export const SummitMulticall = MulticallChain[CHAIN_ID]
