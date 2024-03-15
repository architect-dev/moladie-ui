import { SummitPoints } from '@config/deployments'
import { PointsData } from './pointsTypes'
import multicallAndParse from '@utils/multicall'
import { GlobalBoostFields, BlacklistedFields, DelegateFields, VolumeFields, PointsFields, ScalerFields } from './pointsFields'

export const fetchPointsData = async (account: string) => {
	const summitPoints = SummitPoints.address
	const calls = [
		{
			address: summitPoints,
			name: 'GLOBAL_BOOST',
			params: [],
			fields: GlobalBoostFields,
		},
		{
			address: summitPoints,
			name: 'BLACKLISTED',
			params: [account],
			fields: BlacklistedFields,
		},
		{
			address: summitPoints,
			name: 'DELEGATE',
			params: [account],
			fields: DelegateFields,
		},
		{
			address: summitPoints,
			name: 'getVolume',
			params: [account],
			fields: VolumeFields,
		},
		{
			address: summitPoints,
			name: 'getPoints',
			params: [account],
			fields: PointsFields,
		},
		{
			address: summitPoints,
			name: 'BASE_VOLUME_SCALER',
			params: [],
			fields: ScalerFields('baseVolumeScaler'),
		},
		{
			address: summitPoints,
			name: 'REF_VOLUME_SCALER',
			params: [],
			fields: ScalerFields('refVolumeScaler'),
		},
		{
			address: summitPoints,
			name: 'ADAPTER_VOLUME_SCALER',
			params: [],
			fields: ScalerFields('adapterVolumeScaler'),
		},
	]
	// REF_VOLUME_SCALER
	// ADAPTER_VOLUME_SCALER',

	const res = await multicallAndParse(SummitPoints.abi, calls)
	if (res == null) return null

	let pointsData = { account } as PointsData
	res.forEach((item: any) => {
		pointsData = {
			...pointsData,
			...item,
		}
	})

	return pointsData
}
