import React from 'react'
import styled, { css } from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { MenuEntry } from './types'
import { pressableMixin } from '@uikit/util/styledMixins'
import { Text } from '@uikit/components/Text'
import { Nullable } from '@utils'
import { ExternalLink } from 'react-feather'
import { useMatchBreakpoints } from '@uikit'

interface Props {
	links: Array<MenuEntry>
	mobileNav: boolean
	account: Nullable<string>
}

const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-content: center;
	align-items: center;
	height: 100%;
	gap: 0 24px;
	flex-wrap: wrap;
	max-width: 250px;

	${({ theme }) => theme.mediaQueries.sm} {
		max-width: 100%;
	}
`

const ItemFlex = styled.div<{ selected: boolean; index: number; disabled?: boolean }>`
	display: flex;
	gap: 6px;
	align-items: center;
	justify-content: center;
	position: relative;
	height: 32px;

	.item-label {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 4px;
	}

	${({ theme, disabled = false }) =>
		pressableMixin({
			disabled,
			theme,
			hoverStyles: css`
				.item-label {
					font-weight: bold;
					text-decoration: underline;
					> * {
						stroke-width: 3;
					}
				}
			`,
			disabledStyles: css`
				pointer-events: none;
			`,
		})}

	${({ selected }) =>
		selected &&
		css`
			.item-label {
				font-weight: bold;
				text-decoration: underline;
			}
		`}
`

const NavLinks: React.FC<Props> = ({ links }) => {
	const { isXs, isSm, isMd } = useMatchBreakpoints()
	const isSmall = isXs || isSm || isMd
	const location = useLocation()
	const keyPath = location.pathname.split('/')[1]

	return (
		<Container>
			{links.map((entry, index) => {
				const selected = entry?.keyPaths?.includes(keyPath)
				if (entry.external)
					return (
						<ItemFlex
							key={entry.href}
							disabled={entry.disabled}
							rel='noreferrer noopener'
							target='_blank'
							selected={false}
							index={index}
							as='a'
							href={entry.href}
						>
							<Text className='item-label' strikethrough={entry.disabled} monospace bold={selected}>
								{isSmall ? entry.smLabel ?? entry.label : entry.label}
								<ExternalLink size='14px' />
							</Text>
						</ItemFlex>
					)
				return (
					<ItemFlex key={entry.href} disabled={entry.disabled} selected={selected ?? false} index={index} as={Link} to={entry.href} replace>
						<Text className='item-label' monospace strikethrough={entry.disabled} bold={selected}>
							{isSmall ? entry.smLabel ?? entry.label : entry.label}
						</Text>
					</ItemFlex>
				)
			})}
			{/* <DebugMenu account={account} /> */}
		</Container>
	)
}

export default React.memo(NavLinks)
