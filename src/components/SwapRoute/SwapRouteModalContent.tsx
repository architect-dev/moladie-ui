import { SummitAdapters, WNATIVE } from '@config/deployments'
import { useAggregatorStore } from '@state/aggregator/store'
import { ModalContentContainer, Text } from '@uikit'
import { Fragment } from 'react'
import { SwapRouteTokenRow } from './SwapRouteTokenRow'
import { zeroAdd } from '@config/constants'

const StepIndicator: React.FC<{ adapterName: string | null }> = ({ adapterName }) => {
	return (
		<Text small lineHeight='12px' textAlign='center'>
			<pre>|</pre>
			<pre>|</pre>
			<span style={{ lineHeight: '16px' }}>
				{adapterName}
				<br />
				{'100%'}
			</span>
			<pre>|</pre>
			<pre>|</pre>
			<pre>V</pre>
		</Text>
	)
}

const WrapRoute = () => {
	const isWrap = useAggregatorStore((state) => state.swapData?.trade.isNativeIn)
	return (
		<>
			<SwapRouteTokenRow token={isWrap ? zeroAdd : WNATIVE.address} />
			<StepIndicator adapterName='WETH Contract' />
			<SwapRouteTokenRow token={isWrap ? WNATIVE.address : zeroAdd} />
		</>
	)
}

const SwapRoute = () => {
	const swapData = useAggregatorStore((state) => state.swapData)
	const adapters = SummitAdapters

	return (
		<>
			{(swapData == null || !swapData.valid) && <Text>No swap route to show</Text>}
			{swapData != null &&
				swapData.path.map((pathToken, index) => {
					const replaceWithNative = (index === 0 && swapData.trade.isNativeIn) || (index === swapData.path.length - 1 && swapData.trade.isNativeOut)
					const includeAdapter = index < swapData.path.length - 1
					const adapterAddr = includeAdapter ? swapData.adapters[index] : ''
					const adapter = adapters[adapterAddr]
					const adapterName = includeAdapter ? adapter?.name : null
					return (
						<Fragment key={pathToken}>
							<SwapRouteTokenRow token={replaceWithNative ? zeroAdd : pathToken} />
							{includeAdapter && <StepIndicator adapterName={adapterName} />}
						</Fragment>
					)
				})}
		</>
	)
}

export const SwapRouteModalContent: React.FC = () => {
	const swapData = useAggregatorStore((state) => state.swapData)
	const swapDataFetching = useAggregatorStore((state) => state.swapDataFetching)
	const swapDataDirty = useAggregatorStore((state) => state.swapDataDirty)

	return (
		<ModalContentContainer minWidth='300px' maxHeight='600px' gap='8px'>
			<br />
			{swapDataFetching && swapDataDirty && <Text>Fetching swap data...</Text>}
			{swapData?.trade?.isWrapOrUnwrap ? <WrapRoute /> : <SwapRoute />}
			<br />
		</ModalContentContainer>
	)
}
