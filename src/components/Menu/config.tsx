import { MenuEntry } from '@uikit'

export const getMenuItems = (): MenuEntry[] =>
	[
		{
			label: 'SWAP',
			href: `/swap`,
			external: false,
			keyPaths: ['', 'swap'],
		},
		{
			label: 'DCA',
			href: `/dca`,
			external: false,
			disabled: false,
			keyPaths: ['dca'],
		},
		{
			label: 'POINTS',
			smLabel: 'PTS',
			href: '/points',
			external: false,
			keyPaths: ['points', 'referrals'],
		},
		{
			label: 'PORTFOLIO',
			smLabel: 'FLIO',
			href: '/portfolio',
			external: false,
			keyPaths: ['portfolio'],
		},
	].filter((entry) => entry != null)
