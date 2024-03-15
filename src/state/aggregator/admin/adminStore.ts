import useActiveWeb3React from '@hooks/useActiveWeb3React'
import { Nullable } from '@utils'
import { useEffect } from 'react'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import fetchAccountIsAdmin from './fetchAccountIsAdmin'

type AdminState = {
	isAdmin: boolean
	fetchIsAdmin: (account: Nullable<string>) => void
}

export const useAdminStore = create<AdminState>()(
	immer((set) => ({
		isAdmin: false,
		fetchIsAdmin: async (account) => {
			if (account == null) {
				set({ isAdmin: false })
				return
			}
			const isAdmin = await fetchAccountIsAdmin(account)
			set({ isAdmin })
		},
	}))
)

export const useFetchIsAdmin = () => {
	const { account } = useActiveWeb3React()

	useEffect(() => {
		useAdminStore.getState().fetchIsAdmin(account)
	}, [account])
}
