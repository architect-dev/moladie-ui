import { generateGradient } from '@utils/gradient'
import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Text } from '../Text/Text'

const LpSymbolWrapper = styled.div<{ width: number; height: number; boosted?: boolean }>`
	position: relative;
	width: ${({ width }) => width}px;
	height: ${({ height }) => height}px;
	min-width: ${({ width }) => width}px;
	min-height: ${({ height }) => height}px;
	margin-right: ${({ boosted }) => (boosted ? '36px' : '0')};
`

const PseudoSymbolIcon = styled.div<{ symbol: string; width: number; height: number }>`
	position: absolute;

	width: ${({ width }) => width}px;
	height: ${({ height }) => height}px;

	display: flex;
	align-items: center;
	justify-content: center;
	background: ${({ symbol }) => generateGradient(symbol)};
	border-radius: 50%;

	:after {
		content: '${({ symbol }) => symbol[0]?.toUpperCase()}';
		color: white;
		font-size: 14px;
		font-weight: bold;
	}

	left: 50%;
	top: 50%;
	transform: translateX(-50%) translateY(-50%) scale(0.85);
`

const BaseSymbolIcon = styled.img<{
	symbol: string
	width: number
	height: number
}>`
	position: absolute;

	width: ${({ width }) => width}px;
	height: ${({ height }) => height}px;

	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;
`

const SingleSymbolIcon = styled(BaseSymbolIcon)`
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translateX(-50%) translateY(-50%) scale(0.85);
`

const HueRoll = keyframes`
  0% {
		filter: hue-rotate(120deg);
	}
  30% {
		filter: hue-rotate(290deg);
	}
  100% {
		filter: hue-rotate(220deg);
	}
`

const BonusIndicator = styled(Text)`
	display: flex;
	position: relative;

	border-radius: 20px;
	width: 60px;

	background: ${({ theme }) => theme.colors.warning};
	left: 0px;
	height: 100%;
	top: 0px;

	padding: 0;
	padding-right: 6px;
	align-items: center;
	justify-content: flex-end;
	color: ${({ theme }) => theme.colors.invertedText};
	font-weight: 900;
	font-size: 12px;

	animation: ${HueRoll} 3s linear forwards;
`

interface Props {
	symbol: string
	ext: string
	width: number
	height: number
	className?: string
	bonus?: number
}

const errCache: Record<string, boolean> = {}

const SymbolImage: React.FC<Props> = ({ symbol, ext, width, height, className, bonus }) => {
	const [err, setErr] = useState(errCache[symbol] ?? false)
	useEffect(() => {
		setErr(errCache[symbol] ?? false)
	}, [symbol])
	return (
		<LpSymbolWrapper width={width} height={height} className={className} boosted={bonus != null && bonus > 0}>
			{bonus != null && bonus > 0 && <BonusIndicator>{((10000 + bonus) / 10000).toFixed(1)}X</BonusIndicator>}
			{err ? (
				<PseudoSymbolIcon symbol={symbol} width={width} height={height} />
			) : (
				<SingleSymbolIcon
					symbol={symbol}
					src={`/images/tokens/${symbol}.${ext}`}
					width={width}
					height={height}
					onError={() => {
						setErr(true)
						errCache[symbol] = true
					}}
				/>
			)}
		</LpSymbolWrapper>
	)
}

export default SymbolImage
