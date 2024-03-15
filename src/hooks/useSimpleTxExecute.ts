/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from 'react'
import { useSummitAdmin } from './useContract'
import useToast from './useToast'
import { Contract, PayableOverrides } from '@ethersproject/contracts'
import { callWithEstimateGas } from '@utils/estimateGas'
import { eN } from '@utils'

interface ExecuteParams {
	contract: Contract
	method: string
	args?: any[]
	overrides?: PayableOverrides
	successMsg: string
	errorMsg: string
	callback?: (...cbArgs: any[]) => void
	hydrateConfig?: boolean
}

const useSimpleExecuteTx = () => {
	const [pending, setPending] = useState(false)
	const { toastSuccess, toastError } = useToast()

	const handleExecute = useCallback(
		async ({ contract, method, args = [], overrides = undefined, successMsg, errorMsg, callback }: ExecuteParams) => {
			try {
				setPending(true)
				await callWithEstimateGas(contract, method, args, overrides)
				toastSuccess(successMsg)
			} catch (error) {
				toastError(errorMsg, (error as Error).message)
			} finally {
				setPending(false)
				if (callback != null) callback()
			}
		},
		[toastSuccess, toastError]
	)

	return { handleExecute, pending }
}

export const useAdminSimpleExecute = () => {
	const adminContract = useSummitAdmin()
	const { handleExecute: handleExecuteBase, pending } = useSimpleExecuteTx()

	const handleExecute = useCallback(
		(params: Omit<ExecuteParams, 'contract'>) => {
			if (adminContract == null) return null
			handleExecuteBase({
				contract: adminContract,
				...params,
			})
		},
		[adminContract, handleExecuteBase]
	)

	return { handleExecute, pending }
}

export const useSetTokenVolumeMultipliers = () => {
	const { handleExecute, pending } = useAdminSimpleExecute()

	const onExecute = useCallback(
		(tokens: string[], mults: string[]) => {
			handleExecute({
				method: 'router_setTokenVolumeMultipliers',
				args: [tokens, mults],
				successMsg: `Prices set`,
				errorMsg: 'Error setting prices',
			})
		},
		[handleExecute]
	)

	return { onExecute, pending }
}

export const useSetTokenBoost = () => {
	const { handleExecute, pending } = useAdminSimpleExecute()

	const onExecute = useCallback(
		(token: string, boost: string) => {
			handleExecute({
				method: 'router_setTokenBonusMultipliers',
				args: [[token], [boost]],
				successMsg: `Boosted`,
				errorMsg: 'Error boosting',
			})
		},
		[handleExecute]
	)

	return { onExecute, pending }
}

export const useOverrideReferralCode = () => {
	const { handleExecute, pending } = useAdminSimpleExecute()

	const onExecute = useCallback(
		(user: string, refCode: string) => {
			handleExecute({
				method: 'referrals_overrideReferralCode',
				args: [user, refCode],
				successMsg: `Referral code overridden`,
				errorMsg: 'Error overriding referral code',
			})
		},
		[handleExecute]
	)

	return { onExecute, pending }
}

export const useGiveUserPoints = () => {
	const { handleExecute, pending } = useAdminSimpleExecute()

	const onExecute = useCallback(
		(user: string, points: string) => {
			handleExecute({
				method: 'points_summitTeamGivePoints',
				args: [user, eN(points, 20)], // offset from 18 to 20 because its adding to volume and not points directly
				successMsg: `Points given`,
				errorMsg: 'Error giving points',
			})
		},
		[handleExecute]
	)

	return { onExecute, pending }
}

export const useBoostReferrerLevel = () => {
	const { handleExecute, pending } = useAdminSimpleExecute()

	const onExecute = useCallback(
		(user: string, level: number) => {
			handleExecute({
				method: 'referrals_boostReferrer',
				args: [user, level],
				successMsg: `Referrer boosted`,
				errorMsg: 'Error boosting referrer',
			})
		},
		[handleExecute]
	)

	return { onExecute, pending }
}

export const useSetBlacklisted = () => {
	const { handleExecute, pending } = useAdminSimpleExecute()

	const onExecute = useCallback(
		(user: string, blacklisted: boolean) => {
			handleExecute({
				method: 'points_setBlacklisted',
				args: [user, blacklisted],
				successMsg: `Success setting user blacklisted`,
				errorMsg: 'Error setting user blacklisted',
			})
		},
		[handleExecute]
	)

	return { onExecute, pending }
}

export const useGlobalBoost = () => {
	const { handleExecute, pending } = useAdminSimpleExecute()

	const onExecute = useCallback(
		(globalBoost: string) => {
			handleExecute({
				method: 'points_setGlobalBoost',
				args: [globalBoost],
				successMsg: `Updated global boost`,
				errorMsg: 'Error updating global boost',
			})
		},
		[handleExecute]
	)

	return { onExecute, pending }
}
