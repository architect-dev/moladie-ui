const hexValues1 = '0123456789abcdef'

function createHex(rand: () => number) {
	let hexCode1 = ''
	for (let i = 0; i < 6; i++) {
		hexCode1 += hexValues1.charAt(Math.floor(rand() * hexValues1.length))
	}
	return hexCode1
}

const generateSeed = (seed: string) => {
	let h1 = 1779033703,
		h2 = 3144134277,
		h3 = 1013904242,
		h4 = 2773480762
	for (let i = 0, k; i < seed.length; i++) {
		k = seed.charCodeAt(i)
		h1 = h2 ^ Math.imul(h1 ^ k, 597399067)
		h2 = h3 ^ Math.imul(h2 ^ k, 2869860233)
		h3 = h4 ^ Math.imul(h3 ^ k, 951274213)
		h4 = h1 ^ Math.imul(h4 ^ k, 2716044179)
	}
	h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067)
	h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233)
	h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213)
	h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179)
	;(h1 ^= h2 ^ h3 ^ h4), (h2 ^= h1), (h3 ^= h1), (h4 ^= h1)
	return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0]
}

const splitmix32 = (a: number) => {
	return function () {
		a |= 0
		a = (a + 0x9e3779b9) | 0
		let t = a ^ (a >>> 16)
		t = Math.imul(t, 0x21f0aaad)
		t = t ^ (t >>> 15)
		t = Math.imul(t, 0x735a2d97)
		return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296
	}
}

const cache: Record<string, string> = {}

export const generateGradient = (seed: string) => {
	if (cache[seed] != null) return cache[seed]

	const rand = splitmix32(generateSeed(seed)[0])
	const deg = Math.floor(rand() * 360)

	const gradient = 'linear-gradient(' + deg + 'deg, ' + '#' + createHex(rand) + ', ' + '#' + createHex(rand) + ')'
	cache[seed] = gradient
	return gradient
}

export const gradientDescentFeeComparisonToAlternatives = (): number => {
	return 0
	let num = 0
	for (let i = 0; i < 3; i++) {
		num += Math.random() * (22 / 3)
	}
	return Math.round(Math.abs(num - 11))
}
