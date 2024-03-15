import React from 'react'
import styled, { keyframes } from 'styled-components'

const snowflakes_fall = keyframes`
	0% {
		top: -25%;
		opacity: 0;
	}
	20% {
		top: 5%;
		opacity: 0.5;
	}
	100% {
		top: 125%
	}
`

const snowflakes_shake = keyframes`
	0%,
	100% {
		-webkit-transform: translateX(0);
		transform: translateX(0)
	}
	50% {
		-webkit-transform: translateX(80px);
		transform: translateX(80px)
	}
`

const Snowflake = styled.div`
	position: fixed;
	top: -25%;
	animation: ${snowflakes_fall} 10s linear infinite, ${snowflakes_shake} 3s ease-in-out infinite;
	opacity: 0.5;

	&:nth-of-type(0) {
		left: 1%;
		-webkit-animation-delay: 0s, 0s;
		animation-delay: 0s, 0s;
		animation-duration: 3s, 1s;
	}

	&:nth-of-type(1) {
		left: 10%;
		-webkit-animation-delay: 1s, 1s;
		animation-delay: 1s, 1s;
		animation-duration: 3s, 1s;
	}

	&:nth-of-type(2) {
		left: 20%;
		-webkit-animation-delay: 6s, 0.5s;
		animation-delay: 6s, 0.5s;
		animation-duration: 8s, 2s;
	}

	&:nth-of-type(3) {
		left: 30%;
		-webkit-animation-delay: 4s, 2s;
		animation-delay: 4s, 2s;
		animation-duration: 5s, 2.3s;
	}

	&:nth-of-type(4) {
		left: 40%;
		-webkit-animation-delay: 2s, 2s;
		animation-delay: 2s, 2s;
		animation-duration: 12s, 2s;
	}

	&:nth-of-type(5) {
		left: 50%;
		-webkit-animation-delay: 8s, 3s;
		animation-delay: 8s, 3s;
		animation-duration: 4s, 1.8s;
	}

	&:nth-of-type(6) {
		left: 20%;
		-webkit-animation-delay: 6s, 2s;
		animation-delay: 6s, 2s;
		animation-duration: 9s, 3s;
	}

	&:nth-of-type(7) {
		left: 70%;
		-webkit-animation-delay: 2.5s, 1s;
		animation-delay: 2.5s, 1s;
		animation-duration: 7.5s, 4s;
	}

	&:nth-of-type(8) {
		left: 80%;
		-webkit-animation-delay: 1s, 0s;
		animation-delay: 1s, 0s;
		animation-duration: 6s, 2.1s;
	}

	&:nth-of-type(9) {
		left: 90%;
		-webkit-animation-delay: 3s, 1.5s;
		animation-delay: 3s, 1.5s;
		animation-duration: 5s, 2.2s;
	}

	&:nth-of-type(10) {
		left: 25%;
		-webkit-animation-delay: 2s, 0s;
		animation-delay: 2s, 0s;
		animation-duration: 4s, 1.8s;
	}

	&:nth-of-type(11) {
		left: 35%;
		-webkit-animation-delay: 4s, 2.5s;
		animation-delay: 4s, 2.5s;
		animation-duration: 11s, 3s;
	}
	&:nth-of-type(12) {
		left: 25%;
		-webkit-animation-delay: 4s, 2.5s;
		animation-delay: 5s, 2.5s;
		animation-duration: 9s, 2.5s;
	}
	&:nth-of-type(13) {
		left: 45%;
		-webkit-animation-delay: 4s, 2.5s;
		animation-delay: 7s, 2.5s;
		animation-duration: 6s, 3s;
	}
	&:nth-of-type(14) {
		left: 5%;
		-webkit-animation-delay: 4s, 2.5s;
		animation-delay: 8s, 2.5s;
		animation-duration: 5s, 8s;
	}
	&:nth-of-type(15) {
		left: 95%;
		-webkit-animation-delay: 4s, 2.5s;
		animation-delay: 5s, 2.5s;
		animation-duration: 9s, 0.75s;
	}
	&:nth-of-type(16) {
		left: 15%;
		-webkit-animation-delay: 4s, 2.5s;
		animation-delay: 6.5s, 2.5s;
		animation-duration: 6.5s, 2s;
	}
	&:nth-of-type(17) {
		left: 85%;
		-webkit-animation-delay: 4s, 2.5s;
		animation-delay: 2s, 2.5s;
		animation-duration: 7s, 4s;
	}
	&:nth-of-type(18) {
		left: 15%;
		-webkit-animation-delay: 4s, 2.5s;
		animation-delay: 3.5s, 2.5s;
		animation-duration: 8s, 1.5s;
	}
`

const memeImg = [
	'1.webp',
	'2.jpg',
	'3.jpg',
	'4.jpg',
	'5.jpg',
	'6.jpg',
	'7.jpg',
	'8.webp',
	'9.webp',
	'10.webp',
	'11.webp',
	'12.webp',
	'13.webp',
	'14.webp',
	'15.webp',
	'16.webp',
	'17.webp',
	'18.webp',
	'19.webp',
]

const Snowflakes: React.FC = () => {
	return (
		<>
			{new Array(38).fill('').map((_, i) => (
				<Snowflake key={i}>
					<img src={`/images/memes/${memeImg[i % 19]}`} style={{ width: '180px' }} />
				</Snowflake>
			))}
		</>
	)
}

export default React.memo(Snowflakes)
