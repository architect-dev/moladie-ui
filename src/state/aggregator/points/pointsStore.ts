/* eslint-disable no-param-reassign */
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useEffect } from 'react'
import useActiveWeb3React from '@hooks/useActiveWeb3React'
import { CHAIN_ID } from '@utils'
import { persist } from 'zustand/middleware'
import { PointsState } from './pointsTypes'
import { fetchPointsData } from './fetchPointsData'
import { fetchReferralCodeAccount, fetchReferralsData } from './fetchReferralsData'
import { zeroAdd } from '@config/constants'
import { debounce } from 'lodash'
import { emptyReferralByCodeData, fetchReferrerByCodeData } from './fetchReferrerByCodeData'

export const usePointsStore = create<PointsState>()(
	persist(
		immer((set) => ({
			pointsData: null,
			fetchingPointsData: false,
			fetchAndSetPointsData: async (account) => {
				if (account == null) return
				set({ fetchingPointsData: true, pointsData: null })

				const pointsData = await fetchPointsData(account)
				set({ fetchingPointsData: false, pointsData })
			},

			referralsData: null,
			fetchingReferralsData: false,
			fetchAndSetReferralsData: async (account) => {
				if (account == null) return
				set({ fetchingReferralsData: true, referralsData: null })

				const referralsData = await fetchReferralsData(account)

				set({ fetchingReferralsData: false, referralsData })
			},

			// REFERRER BY CODE
			referrerByCodeData: null,
			fetchingReferrerByCode: false,
			fetchAndSetReferrerByCodeData: async (code: string) => {
				set({ fetchingReferrerByCode: true, referrerByCodeData: null })

				const referrerAccount = await fetchReferralCodeAccount(code)
				if (referrerAccount == null || referrerAccount === zeroAdd) {
					set({ fetchingReferrerByCode: false, referrerByCodeData: emptyReferralByCodeData })
					return
				}

				const referrerByCodeData = await fetchReferrerByCodeData(referrerAccount)
				set({ fetchingReferrerByCode: false, referrerByCodeData })
			},

			// REFERRAL CODE AVAILABLE
			referralCodeAvailable: null,
			fetchingReferralCodeAvailable: false,
			fetchAndSetReferralCodeAvailability: async (code: string) => {
				set({ fetchingReferralCodeAvailable: true, referralCodeAvailable: null })
				const referrerAccount = await fetchReferralCodeAccount(code)
				set({ fetchingReferralCodeAvailable: false, referralCodeAvailable: referrerAccount == null || referrerAccount === zeroAdd })
			},
		})),
		{
			name: `summit_aggregator_points_${CHAIN_ID}`,
		}
	)
)

export const debouncedFetchAndSetReferrerByCodeData = debounce(usePointsStore.getState().fetchAndSetReferrerByCodeData, 500)
export const debouncedFetchAndSetReferralCodeAvailability = debounce(usePointsStore.getState().fetchAndSetReferralCodeAvailability, 500)

export const useFetchUserPointsData = () => {
	const { account } = useActiveWeb3React()
	useEffect(() => {
		usePointsStore.getState().fetchAndSetPointsData(account)
	}, [account])
}
export const useFetchUserReferralsData = () => {
	const { account } = useActiveWeb3React()
	useEffect(() => {
		usePointsStore.getState().fetchAndSetReferralsData(account)
	}, [account])
}
