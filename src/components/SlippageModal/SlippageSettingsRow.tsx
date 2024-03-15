import { Flex, TextButton, Text } from '@uikit'
import { SlippageCustomInput } from './SlippageCustomInput'

export const SlippageSettingRow: React.FC<{ value: string; valueIsCustom: boolean; setValue: (slippage: string, isCustom: boolean) => void }> = ({
	value,
	valueIsCustom,
	setValue,
}) => {
	const bp25Selected = !valueIsCustom && value === '0.25'
	const bp50Selected = !valueIsCustom && value === '0.5'
	const bp100Selected = !valueIsCustom && value === '1'
	return (
		<Flex width='100%' justifyContent='space-between' alignItems='center'>
			<TextButton onClick={() => setValue('0.25', false)} bold={bp25Selected}>
				<pre>{bp25Selected ? '(0.25%)' : ' 0.25% '}</pre>
			</TextButton>
			<Text>/</Text>
			<TextButton onClick={() => setValue('0.5', false)} bold={bp50Selected}>
				<pre>{bp50Selected ? '(0.5%)' : ' 0.5% '}</pre>
			</TextButton>
			<Text>/</Text>
			<TextButton onClick={() => setValue('1', false)} bold={bp100Selected}>
				<pre>{bp100Selected ? '(1.0%)' : ' 1.0% '}</pre>
			</TextButton>
			<Text>/</Text>
			<SlippageCustomInput custom={value} valueIsCustom={valueIsCustom} setCustom={(val: string) => setValue(val, true)} />
		</Flex>
	)
}
