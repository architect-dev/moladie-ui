import React from 'react'
import { TextSelector } from '@components/TextToggle'

interface Props {
	isDark: boolean
	toggleTheme: () => void
}

const DarkModeToggle: React.FC<Props> = ({ isDark, toggleTheme }) => {
	return (
		<TextSelector<boolean>
			options={[
				{
					value: false,
					text: 'Light',
				},
				{
					value: true,
					text: 'Dark',
				},
			]}
			value={isDark}
			setValue={(dark) => dark !== isDark && toggleTheme()}
		/>
	)
}

export default DarkModeToggle
