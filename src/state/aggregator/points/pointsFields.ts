import { ParseFieldConfig, ParseFieldType } from '@utils'

// POINTS
export const GlobalBoostFields: Record<string, ParseFieldConfig> = {
	'0': {
		type: ParseFieldType.number,
		stateField: 'globalBoost',
	},
}
export const BlacklistedFields: Record<string, ParseFieldConfig> = {
	'0': {
		type: ParseFieldType.bool,
		stateField: 'blacklisted',
	},
}
export const DelegateFields: Record<string, ParseFieldConfig> = {
	'0': {
		type: ParseFieldType.address,
		stateField: 'delegate',
	},
}
export const VolumeFields: Record<string, ParseFieldConfig> = {
	selfVolume: { type: ParseFieldType.number18Dec },
	refVolume: { type: ParseFieldType.number18Dec },
	adapterVolume: { type: ParseFieldType.number18Dec },
}
export const PointsFields: Record<string, ParseFieldConfig> = {
	pointsFromSelf: { type: ParseFieldType.number18Dec },
	pointsFromRef: { type: ParseFieldType.number18Dec },
	pointsFromAdapter: { type: ParseFieldType.number18Dec },
	pointsTotal: { type: ParseFieldType.number18Dec },
}
export const ScalerFields = (stateField: string): Record<string, ParseFieldConfig> => ({
	'0': {
		type: ParseFieldType.number,
		stateField,
	},
})

// REFERRALS
export const BonusForBeingReferredFields: Record<string, ParseFieldConfig> = {
	'0': {
		type: ParseFieldType.number,
		stateField: 'bonusForBeingReferred',
	},
}
export const ReferrerFields: Record<string, ParseFieldConfig> = {
	'0': {
		type: ParseFieldType.address,
		stateField: 'referrer',
	},
}
export const ReferrerCodeFields: Record<string, ParseFieldConfig> = {
	'0': {
		type: ParseFieldType.string,
		stateField: 'referrerCode',
	},
}
export const RefCountFields: Record<string, ParseFieldConfig> = {
	'0': {
		type: ParseFieldType.number,
		stateField: 'refCount',
	},
}
export const LevelFields: Record<string, ParseFieldConfig> = {
	'0': {
		type: ParseFieldType.numberRaw,
		stateField: 'level',
	},
}
export const BoostedLevelFields: Record<string, ParseFieldConfig> = {
	'0': {
		type: ParseFieldType.numberRaw,
		stateField: 'boostedLevel',
	},
}
export const InvRefCodeFields: Record<string, ParseFieldConfig> = {
	'0': {
		type: ParseFieldType.string,
		stateField: 'refCode',
	},
}
export const RefCodeFields: Record<string, ParseFieldConfig> = {
	'0': {
		type: ParseFieldType.address,
		stateField: 'account',
	},
}
export const RequirementsFields: Record<string, ParseFieldConfig> = {
	selfVolume: { type: ParseFieldType.number18Dec },
	refVolume: { type: ParseFieldType.number18Dec },
	refsCount: { type: ParseFieldType.number, stateField: 'refCount' },
}
