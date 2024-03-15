import { SummitReferrals } from '@config/deployments'
import { ReferralsData } from './pointsTypes'
import multicallAndParse from '@utils/multicall'
import {
	BonusForBeingReferredFields,
	ReferrerFields,
	ReferrerCodeFields,
	RefCountFields,
	LevelFields,
	BoostedLevelFields,
	InvRefCodeFields,
	RequirementsFields,
	RefCodeFields,
} from './pointsFields'

export const fetchReferralsData = async (account: string) => {
	const calls = [
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

	const res = await multicallAndParse(SummitReferrals.abi, calls)
	if (res == null) return null

	const nextLevelRequirements = res[res.length - 1]

	let referralsData = { account, nextLevelRequirements } as ReferralsData
	res.slice(0, res.length - 1).forEach((item: any) => {
		referralsData = {
			...referralsData,
			...item,
		}
	})

	return referralsData
}

export const fetchReferralCodeAccount = async (code: string) => {
	const calls = [
		{
			address: SummitReferrals.address,
			name: 'REF_CODE',
			params: [code],
			fields: RefCodeFields,
		},
	]

	const res = await multicallAndParse(SummitReferrals.abi, calls)
	if (res == null) return null

	return res[0].account
}
