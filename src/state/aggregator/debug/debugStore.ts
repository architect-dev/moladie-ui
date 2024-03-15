import immer from 'immer'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type DebugState = {
	debug: boolean
	setDebug: (debug: boolean) => void
}

export const useDebugStore = create<DebugState>()(
	persist(
		immer((set) => ({
			debug: false,
			setDebug: (debug: boolean) => {
				console.log(`SummitSwap :: Debugging ${debug ? 'Enabled' : 'Disabled'}`)
				set({ debug })
			},
		})),
		{
			name: `summit_aggregator_debug`,
		}
	)
)

type Console = typeof console
export const dbg = ((oldCons: Console) => {
	return {
		log: (...params: Parameters<Console['log']>) => {
			if (!useDebugStore.getState().debug) return
			oldCons.log('SummitSwap ::', ...params)
		},
		info: function (...params: Parameters<Console['info']>) {
			if (!useDebugStore.getState().debug) return
			oldCons.log('SummitSwap ::', ...params)
		},
		warn: function (...params: Parameters<Console['warn']>) {
			if (!useDebugStore.getState().debug) return
			oldCons.log('SummitSwap ::', ...params)
		},
		error: function (...params: Parameters<Console['error']>) {
			if (!useDebugStore.getState().debug) return
			oldCons.log('SummitSwap ::', ...params)
		},
	}
})(console)

export const useDebug = () => {
	return useDebugStore((state) => state.debug)
}
