import { useAggregatorStore } from '@state/aggregator/store'
import { ModalContentContainer, SummitButton, Text } from '@uikit'
import { useState, useCallback, useMemo } from 'react'
import { SlippageSettingRow } from './SlippageSettingsRow'

export const SlippageModalContent: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
	const slippage = useAggregatorStore((state) => state.slippage)
	const setSlippage = useAggregatorStore((state) => state.setSlippage)
	const [tempSlippage, setTempSlippage] = useState(`${slippage / 100}`)
	const [valueIsCustom, setValueIsCustom] = useState(slippage !== 10 && slippage !== 50 && slippage !== 100)

	const updateTempSlippage = useCallback((val: string, isCustom: boolean) => {
		setTempSlippage(val)
		setValueIsCustom(isCustom)
	}, [])

	const slippageError = useMemo(() => {
		const slipNum = parseFloat(tempSlippage)
		if (isNaN(slipNum) || slipNum < 0) return { level: 'error', message: 'Invalid Slippage' }
		if (slipNum < 0.1) return { level: 'warn', message: 'Low slippage, transactions may fail' }
		if (slipNum >= 50) return { level: 'error', message: 'Slippage cannot exceed 50%' }
		if (slipNum >= 5) return { level: 'warn', message: 'High slippage, transactions may be frontrun' }
		return { level: 'success', message: null }
	}, [tempSlippage])

	const saveSlippage = useCallback(() => {
		if (slippageError.level === 'error') return
		const tempSlipFloat = parseFloat(tempSlippage)
		setSlippage(tempSlipFloat * 100)
		onDismiss?.()
	}, [onDismiss, setSlippage, slippageError.level, tempSlippage])

	return (
		<ModalContentContainer minWidth='300px' maxHeight='600px' gap='18px'>
			<Text mt='12px'>Adjust your slippage tolerance:</Text>
			<SlippageSettingRow value={tempSlippage} valueIsCustom={valueIsCustom} setValue={updateTempSlippage} />
			<Text red={slippageError.level === 'error'} warn={slippageError.level === 'warn'}>
				{slippageError.message}
			</Text>
			<SummitButton onClick={saveSlippage} disabled={slippageError.level === 'error'}>
				Save
			</SummitButton>
		</ModalContentContainer>
	)
}
