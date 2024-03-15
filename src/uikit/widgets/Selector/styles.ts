import styled, { css, DefaultTheme } from 'styled-components'

export const selectorWrapperMixin = ({
	theme,
	disabled = false,
	isLocked = false,
	invalid = false,
}: {
	theme: DefaultTheme
	disabled?: boolean
	isLocked?: boolean
	invalid?: boolean
}) => {
	return css`
		border-radius: 6px;
		background-color: ${theme.colors.selectorBackground};
		box-shadow: ${disabled || isLocked ? 'none' : `0px 5px 10px ${theme.colors.text}20`};
		transform: none;
		${invalid &&
		css`
			box-shadow: ${disabled || isLocked ? 'none' : `0px 10px 20px ${theme.colors.failure}40`};
		`}
		:hover, :focus-within {
			box-shadow: ${disabled || isLocked ? 'none' : `0px 12px 20px ${invalid ? theme.colors.failure : theme.colors.text}40`};
		}
	`
}

export const SelectorWrapperBase = styled.div<{ disabled?: boolean; isLocked?: boolean; invalid?: boolean }>`
	${selectorWrapperMixin}
`
