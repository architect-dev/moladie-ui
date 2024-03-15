import { TextButton, Text, Flex } from '@uikit'
import React, { Fragment, useMemo } from 'react'

type Option<T extends boolean | string> = {
	value: T
	text: string
}

type Props<T extends boolean | string> = {
	vertical?: boolean
	setValue: (val: T) => void
	value: T
	options: Option<T>[]
}

export function TextSelector<T extends string | boolean>({ vertical = false, value, setValue, options }: Props<T>) {
	return (
		<Flex flex={0} flexDirection={vertical ? 'column' : 'row'} alignItems='center' justifyContent='center' gap='4px'>
			{options.map((option, index) => {
				return (
					<Fragment key={`${option.value}`}>
						<TextButton onClick={() => setValue(option.value)} bold={value === option.value} padding='4px'>
							<pre>{value === option.value ? `(${option.text})` : ` ${option.text} `}</pre>
						</TextButton>
						{index < options.length - 1 && !vertical && <Text>/</Text>}
					</Fragment>
				)
			})}
		</Flex>
	)
}

export const TextToggle: React.FC<Pick<Props<boolean>, 'value' | 'setValue'>> = ({ value, setValue }) => {
	const options = useMemo(
		() => [
			{
				value: true,
				text: 'Y',
			},
			{
				value: false,
				text: 'N',
			},
		],
		[]
	)
	return <TextSelector<boolean> options={options} value={value} setValue={setValue} />
}
