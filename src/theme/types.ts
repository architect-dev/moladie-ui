export type Breakpoints = string[]

export type MediaQueries = {
	xs: string
	sm: string
	md: string
	lg: string
	xl: string
	nav: string
	invNav: string
}

export type Spacing = number[]

export type Radii = {
	small: string
	default: string
	card: string
	circle: string
}

export type Shadows = {
	level1: string
	active: string
	success: string
	warning: string
	focus: string
	inset: string
}

export type Colors = {
	primary: string
	primaryBright: string
	primaryDark: string
	secondary: string
	tertiary: string
	success: string
	failure: string
	warning: string
	contrast: string
	invertedContrast: string
	input: string
	inputSecondary: string
	background: string
	cardHover: string
	backgroundDisabled: string
	text: string
	invertedText: string
	textShadow: string
	textDisabled: string
	textSubtle: string
	buttonText: string
	borderColor: string
	card: string
	shadow: string
	selectorBackground: string
	button: string

	// BRAND COLORS
	quartz: string
}

export type ZIndices = {
	dropdown: number
	modal: number
}
