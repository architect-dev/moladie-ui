/* eslint-disable @typescript-eslint/no-explicit-any */
import multicallAndParse, { ParseFieldConfig, ParseFieldType } from '@utils/multicall'
import { SummitAdmin } from '@config/deployments'

const MAINTAINER_ROLE = '0x339759585899103d2ace64958e37e18ccb0504652c81d4a1b8aa80fe2126ab95'
const hasRoleFields: Record<string, ParseFieldConfig> = {
	'0': { type: ParseFieldType.bool },
}

const fetchAccountIsAdmin = async (account: string) => {
	const calls = [
		{
			address: SummitAdmin.address,
			name: 'hasRole',
			params: [MAINTAINER_ROLE, account],
			fields: hasRoleFields,
		},
	]

	const res = await multicallAndParse(SummitAdmin.abi, calls)
	if (res == null) return false

	return res[0][0]
}

export default fetchAccountIsAdmin
