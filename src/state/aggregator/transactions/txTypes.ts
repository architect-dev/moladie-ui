export enum TxStatus {
	Unknown = 'Unknown',
	Incomplete = 'Incomplete',
	WaitingForWallet = 'WaitingForWallet',
	Pending = 'Pending',
	Finalized = 'Finalized',
}

export type TxStatusAndHash = {
	txStatus: TxStatus
	txHash: string | null
}

export type TxStatusAndCallback = {
	txStatus: TxStatus
	txHash: string | null
	txError: string | null
	callback: (() => Promise<void>) | null
	resetError: () => void
}

export interface TransactionDetails {
	hash: string
	approval?: { tokenAddress: string; spender: string; amount: string }
	swap?: { inputAddress: string; exactIn: string | null; outputAddress: string; exactOut: string | null }
	wrap?: { wrapAmount: string | null; unwrapAmount: string | null }
	setReferralCode?: { code: string }
	setReferrer?: { code: string }
	summary?: string
	receipt?: SerializableTransactionReceipt
	lastCheckedBlockNumber?: number
	addedTime: number
	confirmedTime?: number
	from: string
	acknowledged?: boolean
}

export interface TransactionState {
	[chainId: number]: {
		[txHash: string]: TransactionDetails
	}
}

export interface TransactionMutators {
	addTransaction: (params: { chainId: number; hash: string; from: string } & AddTransactionCustomData) => void
	clearAllTransactions: (params: { chainId: number }) => void
	finalizeTransaction: (params: { chainId: number; hash: string; receipt: SerializableTransactionReceipt }) => void
	checkedTransaction: (params: { chainId: number; hash: string; blockNumber: number }) => void
	acknowledgeTransaction: (params: { chainId: number; hash: string }) => void
	// addTransactionSet: (params: { chainId: number; hash: string; title: string; txs: TransactionSetItem[] }) => void
}

export interface TransactionSetItem {
	hash?: string
	text: string
}
export interface TransactionSetDetails {
	title: string
	txs: TransactionSetItem[]
	addedTime: number
}

export interface TransactionSetState {
	[chainId: number]: {
		[txHash: string]: TransactionSetDetails
	}
}

export type LimitTransactionType = 'submission' | 'cancellation'

export interface SerializableTransactionReceipt {
	to: string
	from: string
	contractAddress: string
	transactionIndex: number
	blockHash: string
	transactionHash: string
	blockNumber: number
	status?: number
}

export type AddTransactionCustomData = Pick<TransactionDetails, 'summary' | 'approval' | 'swap' | 'wrap' | 'setReferralCode' | 'setReferrer'>

export type BlockNumberState = {
	blockNumber: { [chainId: number]: number }
	updateBlockNumber: (params: { chainId: number; blockNumber: number }) => void
}

export interface TxState extends TransactionMutators, BlockNumberState {
	txs: TransactionState
}
