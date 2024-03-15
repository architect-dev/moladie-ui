import { TextSelector, TextToggle } from '@components/TextToggle'
import { useDebugStore } from '@state/aggregator/debug/debugStore'
import { useAggregatorStore } from '@state/aggregator/store'
import { RoutePriorityType } from '@state/aggregator/types'
import { Flex, Text } from '@uikit'
import { useCallback } from 'react'

export const InfApprovalsSettingRow: React.FC = () => {
	const infApprovals = useAggregatorStore((state) => state.infApprovals)
	const setInfApprovals = useAggregatorStore((state) => state.setInfApprovals)
	return (
		<Flex width='100%' justifyContent='space-between' alignItems='flex-start'>
			<Text>
				Infinite Approvals
				<br />
				<Text small paddingLeft='8px'>
					(Should approve max amount
					<br />
					instead of swap amount?)
				</Text>
			</Text>
			<TextToggle value={infApprovals} setValue={setInfApprovals} />
		</Flex>
	)
}

export const InfPermitsSettingRow: React.FC = () => {
	const infPermits = useAggregatorStore((state) => state.infPermits)
	const setInfPermits = useAggregatorStore((state) => state.setInfPermits)
	return (
		<Flex width='100%' justifyContent='space-between' alignItems='flex-start'>
			<Text>
				Permit Approvals
				<br />
				<Text small paddingLeft='8px'>
					(Should use EIP-2612
					<br />
					for gasless approvals?)
				</Text>
			</Text>
			<TextToggle value={infPermits} setValue={setInfPermits} />
		</Flex>
	)
}

export const RoutePriorityRow: React.FC = () => {
	const routePriority = useAggregatorStore((state) => state.routePriority)

	const handleUpdated = useCallback((prioRaw: string) => {
		const prio = prioRaw as RoutePriorityType
		if (prio == useAggregatorStore.getState().routePriority) return
		useAggregatorStore.getState().setRoutePriority(prio)
		useAggregatorStore.getState().refreshSwap()
	}, [])

	return (
		<Flex width='100%' justifyContent='space-between' alignItems='flex-start'>
			<Text>
				Routing Priority
				<br />
				<Text small paddingLeft='8px'>
					(What to prioritize when
					<br />
					finding swap route)
				</Text>
			</Text>
			<TextSelector
				options={[
					{ value: 'output-amount', text: '⇈ out' },
					{ value: 'least-gas', text: '⇊ gas' },
				]}
				value={routePriority as string}
				setValue={handleUpdated}
			/>
		</Flex>
	)
}

export const DebugRow: React.FC = () => {
	const debug = useDebugStore((state) => state.debug)
	const setDebug = useDebugStore((state) => state.setDebug)

	return (
		<Flex width='100%' justifyContent='space-between' alignItems='flex-start'>
			<Text>
				Debugging
				<br />
				<Text small paddingLeft='8px'>
					(Whether to print debug
					<br />
					messages to console)
				</Text>
			</Text>
			<TextToggle value={debug} setValue={setDebug} />
		</Flex>
	)
}
