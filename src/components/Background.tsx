import { atom, useAtom } from 'jotai'
import React from 'react'
import styled, { keyframes } from 'styled-components'

export const shake = keyframes`
	0% {
    transform: scale(1.1) translate(4px, 4px) rotate(0deg);
	}
	10% {
			transform: scale(1.1) translate(-4px, -14px) rotate(-4deg);
	}
	20% {
			transform: scale(1.1) translate(-20px) rotate(3deg);
	}
	30% {
			transform: scale(1.1) translate(10px, 6px) rotate(0deg);
	}
	40% {
			transform: scale(1.1) translate(4px, -4px) rotate(3deg);
	}
	50% {
			transform: scale(1.1) translate(-4px, 6px) rotate(-5deg);
	}
	60% {
			transform: scale(1.1) translate(-20px, 4px) rotate(0deg);
	}
	70% {
			transform: scale(1.1) translate(10px, 4px) rotate(-1deg);
	}
	80% {
			transform: scale(1.1) translate(-4px, -4px) rotate(6deg);
	}
	90% {
			transform: scale(1.1) translate(4px, -14px) rotate(-3deg);
	}
	100% {
			transform: scale(1.1) translate(4px, 4px) rotate(0deg);
	}
`

const BackgroundImage = styled.div<{ calm: boolean }>`
	--noise-4: url("data:image/svg+xml,%3Csvg viewBox='0 0 100% 100%' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
	--gradient-3: radial-gradient(circle at top right, hsl(180 100% 50%), hsl(180 100% 50% / 0%)),
		radial-gradient(circle at bottom left, hsl(328 100% 54%), hsl(328 100% 54% / 0%));

	position: fixed;
	isolation: isolate;
	height: 100%;
	width: 100%;
	max-width: 100%;
	max-height: 100%;
	pointer-events: none;

	mask-image: var(--noise-4);
	background: radial-gradient(circle at 60% 25%, #ffecd2 30%, #f7cac9 60%, #f4b4b3 100%);
	background: radial-gradient(circle at bottom right, #ffecd2 10%, transparent 60%), conic-gradient(from 180deg at 100% 5%, #f4b4b3 10%, transparent 15%),
		conic-gradient(from -90deg at 0% 35%, #ffecd2 45%, #f7cac9 60%, #f4b4b3 75%, #f4b4b3 100%);
	background-image: url('/images/paris2.png'), var(--gradient-3), var(--noise-4);
	background-size: cover;
	background-position: 10% 50%;

	animation: ${shake} ${({ calm }) => (calm ? 0.5 : 0.2)}s infinite;

	/* transition: 200ms; */
`

const CalmBackground = styled.div<{ calm: boolean }>`
	position: fixed;
	isolation: isolate;
	height: 100%;
	width: 100%;
	max-width: 100%;
	max-height: 100%;
	pointer-events: none;
	background-color: #dac3b3;
	opacity: ${({ calm }) => (calm ? 1 : 0)};
	transition: 1000ms;
`

export const calmAtom = atom(false)

const Background: React.FC = () => {
	const [calm] = useAtom(calmAtom)
	return (
		<>
			<BackgroundImage calm={calm} />
			<CalmBackground calm={calm} />
		</>
	)
}

export default React.memo(Background)
