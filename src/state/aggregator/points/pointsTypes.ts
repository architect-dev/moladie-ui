import { Nullable } from '@utils'

export interface PointsData {
	account: string
	globalBoost: number
	blacklisted: boolean
	delegate: string
	selfVolume: number
	refVolume: number
	adapterVolume: number
	pointsFromSelf: number
	pointsFromRef: number
	pointsFromAdapter: number
	pointsTotal: number
	baseVolumeScaler: number
	refVolumeScaler: number
	adapterVolumeScaler: number
}
export interface PointsMutators {
	fetchingPointsData: boolean
	fetchAndSetPointsData: (account: Nullable<string>) => void
}

export interface ReferralsData {
	account: string
	bonusForBeingReferred: number
	referrer: string
	referrerCode: string
	refCount: number
	level: number
	boostedLevel: number
	refCode: string
	nextLevelRequirements: {
		selfVolume: number
		refVolume: number
		refCount: number
	}
}
export interface ReferralsMutators {
	fetchingReferralsData: boolean
	fetchAndSetReferralsData: (account: Nullable<string>) => void
}

export interface ReferralByCodeData extends ReferralsData, Pick<PointsData, 'pointsTotal' | 'selfVolume' | 'refVolume'> {}
export interface ReferrerByCodeState {
	referrerByCodeData: Nullable<ReferralByCodeData>
	fetchingReferrerByCode: boolean
	fetchAndSetReferrerByCodeData: (code: string) => void
}

export interface ReferralCodeAvailabilityState {
	referralCodeAvailable: Nullable<boolean>
	fetchingReferralCodeAvailable: boolean
	fetchAndSetReferralCodeAvailability: (code: string) => void
}

export interface PointsState extends PointsMutators, ReferralsMutators, ReferrerByCodeState, ReferralCodeAvailabilityState {
	pointsData: Nullable<PointsData>
	referralsData: Nullable<ReferralsData>
}
