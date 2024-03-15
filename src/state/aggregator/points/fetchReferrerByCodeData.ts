import { SummitPoints, SummitReferrals } from '@config/deployments'
import { ReferralByCodeData } from './pointsTypes'
import multicallAndParse from '@utils/multicall'
import { zeroAdd } from '@config/constants'
import {
	BonusForBeingReferredFields,
	ReferrerFields,
	ReferrerCodeFields,
	RefCountFields,
	LevelFields,
	BoostedLevelFields,
	InvRefCodeFields,
	RequirementsFields,
	PointsFields,
	VolumeFields,
} from './pointsFields'

export const fetchReferrerByCodeData = async (account: string) => {
	const pointsCalls = [
		{
			address: SummitPoints.address,
			name: 'getVolume',
			params: [account],
			fields: VolumeFields,
		},
		{
			address: SummitPoints.address,
			name: 'getPoints',
			params: [account],
			fields: PointsFields,
		},
	]
	const referralsCalls = [
		{
			address: SummitReferrals.address,
			name: 'BONUS_FOR_BEING_REFERRED',
			params: [],
			fields: BonusForBeingReferredFields,
		},
		{
			address: SummitReferrals.address,
			name: 'getReferrer',
			params: [account],
			fields: ReferrerFields,
		},
		{
			address: SummitReferrals.address,
			name: 'getReferrerCode',
			params: [account],
			fields: ReferrerCodeFields,
		},
		{
			address: SummitReferrals.address,
			name: 'REF_COUNT',
			params: [account],
			fields: RefCountFields,
		},
		{
			address: SummitReferrals.address,
			name: 'getReferrerLevelWithoutBoost',
			params: [account],
			fields: LevelFields,
		},
		{
			address: SummitReferrals.address,
			name: 'getReferrerLevel',
			params: [account],
			fields: BoostedLevelFields,
		},
		{
			address: SummitReferrals.address,
			name: 'REF_CODE_INV',
			params: [account],
			fields: InvRefCodeFields,
		},
		{
			address: SummitReferrals.address,
			name: 'getUserNextLevelRequirements',
			params: [account],
			fields: RequirementsFields,
		},
	]

	const [pointsRes, referralsRes] = await Promise.all([
		multicallAndParse(SummitPoints.abi, pointsCalls),
		multicallAndParse(SummitReferrals.abi, referralsCalls),
	])
	if (pointsRes == null || referralsRes == null) return null

	const { selfVolume, refVolume } = pointsRes[0]
	const { pointsTotal } = pointsRes[1]
	const nextLevelRequirements = referralsRes[referralsRes.length - 1]

	let referralsData = { account, nextLevelRequirements, selfVolume, refVolume, pointsTotal } as ReferralByCodeData
	referralsRes.slice(0, referralsRes.length - 1).forEach((item: any) => {
		referralsData = {
			...referralsData,
			...item,
		}
	})

	return referralsData
}

export const emptyReferralByCodeData: ReferralByCodeData = {
	account: zeroAdd,
	bonusForBeingReferred: 200,
	referrer: zeroAdd,
	referrerCode: '',
	refCount: 0,
	level: 0,
	boostedLevel: 0,
	refCode: '',
	nextLevelRequirements: {
		selfVolume: 0,
		refVolume: 0,
		refCount: 0,
	},
	selfVolume: 0,
	refVolume: 0,
	pointsTotal: 0,
}
