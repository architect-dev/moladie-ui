import styled, { css, DefaultTheme } from 'styled-components'
import { space, typography } from 'styled-system'
import { pressableMixin } from '@uikit/util/styledMixins'
import { TextProps } from './types'

export interface ThemedProps extends TextProps {
	theme: DefaultTheme
}

export const getColor = ({ color, red, gold, warn, buttonText, theme, inverted }: ThemedProps) => {
	if (red) return theme.colors.failure
	if (warn) return theme.colors.warning
	if (gold) return '#ffc800'
	if (buttonText) return theme.colors.buttonText
	if (inverted) return theme.colors.invertedText
	if (color == null || color === 'text') return theme.colors.text
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return color // theme.colors[color] || theme.colors.text
}

const getFontSize = ({ fontSize, small }: TextProps) => {
	return small ? '12px' : fontSize || '13px'
}

export const breakTextBr = (breakableText: string): Array<string | JSX.Element> => {
	return breakableText.split('|').map((text) => (text === 'br' ? <br key={text} /> : text))
}

export const Text = styled.div<TextProps>`
	color: ${getColor};
	font-size: ${getFontSize};
	font-weight: ${({ bold }) => (bold ? 600 : 400)};
	font-style: ${({ italic }) => (italic ? 'italic' : 'default')};
	text-decoration: ${({ underline, strikethrough }) => (strikethrough ? 'line-through' : underline ? 'underline' : 'default')};
	line-height: 1.5;
	text-align: left;
	${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
	${space};
	${typography};
`

export const TextWithChanged = styled(Text)<{ changed?: boolean; asterisk?: boolean; asteriskPosition?: string }>`
	display: flex;
	position: relative;
	${({ changed, asterisk, asteriskPosition, theme }) =>
		changed &&
		(asterisk
			? css`
					:after {
						content: '*';
						color: ${theme.colors.warning};
						font-size: 14px;
						font-weight: bold;
						position: absolute;
						top: ${asteriskPosition ? asteriskPosition.split(' ')[0] : '-6px'};
						right: ${asteriskPosition ? asteriskPosition.split(' ')[1] : '-8px'};
					}
			  `
			: css`
					:after {
						color: ${theme.colors.warning};
						content: '(changed)';
						margin-left: 4px;
						font-weight: bold;
					}
			  `)}
`

export const TextButton = styled(TextWithChanged)<{ disabled?: boolean }>`
	cursor: pointer;
	line-height: 24px;
	cursor: pointer;
	padding: 0px 8px;
	margin: 0px -8px;
	color: ${getColor};
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;

	${pressableMixin};

	&:hover {
		font-weight: bold;
		text-decoration: underline;
		> * {
			stroke-width: 3;
		}
	}
`

Text.defaultProps = {
	color: 'text',
	small: false,
}
