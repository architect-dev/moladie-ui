import React from 'react'
import styled, { css } from 'styled-components'
import { Svg, SvgProps, Text } from '@uikit'
import { pressableMixin } from '@uikit/util/styledMixins'
import { Link } from 'react-router-dom'

export const SummitSwapLogoIcon: React.FC<SvgProps> = (props) => {
	return (
		<Svg viewBox='0 0 505 505' {...props} style={{ isolation: 'isolate' }}>
			<path d='M501 370.624L257.131 1L1 370.624L257.131 501L501 370.624Z' />
		</Svg>
	)
}

const LogoText = styled(Text)`
	display: none;
	${({ theme }) => theme.mediaQueries.md} {
		display: block;
	}
`

const SummitLogoButton = styled.div`
	display: flex;
	flex-direction: row;
	gap: 4px;
	align-items: center;
	justify-content: center;

	${({ theme }) =>
		pressableMixin({
			theme,
			hoverStyles: css`
				.summit-logo-dot {
					box-shadow: 0 10px 20px ${theme.colors.text}60;
				}
			`,
		})};
`

const LogoDot = styled.div`
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background-image: url('/images/summit/Logo.png');
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;

	${({ theme }) =>
		theme.isDark &&
		css`
			filter: invert(1) sepia(1) hue-rotate(204deg);
		`}
`

export const Header: React.FC = () => {
	return (
		<SummitLogoButton as={Link} to='/' replace>
			<LogoDot />
			{/* <SummitLogoDot className='summit-logo-dot'>
				<SummitSwapLogoIcon width='18px' height='18px' />
			</SummitLogoDot> */}
			<LogoText className='sticky' fontSize='20px' letterSpacing='8px' lineHeight='22px'>
				SUMMIT
				<Text fontSize='14px' letterSpacing='3px' lineHeight='16px'>
					<pre>{'S  W  A  P'}</pre>
				</Text>
			</LogoText>
		</SummitLogoButton>
	)
}
