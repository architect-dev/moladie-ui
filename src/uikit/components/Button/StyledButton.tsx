import styled, { css, DefaultTheme } from 'styled-components'
import { space, layout, variant } from 'styled-system'
import { pressableMixin } from '@uikit/util/styledMixins'
import { scaleVariants, styleVariants } from './theme'
import { BaseButtonProps } from './types'

interface ThemedButtonProps extends BaseButtonProps {
	theme: DefaultTheme
	isLocked?: boolean
}

const getDisabledStyles = ({ isLoading, isLocked = false }: ThemedButtonProps) => {
	if (isLocked) {
		return css`
			&:disabled,
			&.summit-button--disabled {
				cursor: not-allowed;
			}
			filter: grayscale(1);
			opacity: 0.5;
			box-shadow: none;
			cursor: not-allowed;
			.secondary-inset {
				box-shadow: none;
			}
		`
	}

	if (isLoading === true) {
		return css`
			&:disabled,
			&.summit-button--disabled {
				cursor: not-allowed;
			}
			opacity: 0.5;
		`
	}

	return css`
		&:disabled,
		&.summit-button--disabled {
			box-shadow: none;
			cursor: not-allowed;
			.secondary-inset {
				box-shadow: none;
			}
		}
	`
}

const StyledButton = styled.button<BaseButtonProps>`
	cursor: pointer;
	align-items: center;
	border: 0;
	border-radius: 6px;
	display: inline-flex;
	font-size: 14px;
	font-weight: 600;
	justify-content: center;
	letter-spacing: 0.03em;
	line-height: 1;
	outline: 0;
	box-shadow: 0px 5px 10px ${({ theme }) => theme.colors.text}20;
	transform: none;
	svg {
		/* transition: stroke-width 100ms ease-in-out; */
	}

	${pressableMixin}

	&:hover:not(:disabled):not(.summit-button--disabled):not(.summit-button--disabled):not(:active) {
		/* transform: translate(-1px, -1px); */
		box-shadow: 0px 10px 20px ${({ theme }) => theme.colors.text}50;
		svg {
			stroke-width: 3;
		}
	}

	&:active:not(:disabled):not(.summit-button--disabled):not(.summit-button--disabled) {
		box-shadow: 0px 10px 20px ${({ theme }) => theme.colors.text}20;
	}

	${getDisabledStyles}
	${variant({
		prop: 'scale',
		variants: scaleVariants,
	})}
  ${variant({
		variants: styleVariants,
	})}
  ${layout}
  ${space}
`

export default StyledButton
