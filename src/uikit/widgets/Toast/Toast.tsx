import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import styled, { DefaultTheme, keyframes } from 'styled-components'
import { Alert, alertVariants } from '../../components/Alert'
import { Text } from '../../components/Text'
import ToastAction from './ToastAction'
import { ToastProps, types } from './types'
import { ExternalLinkButton, RowStart } from '@uikit'
import { getLinks } from '@config/constants'
import { AlertProps, variants } from '@uikit/components/Alert/types'

const alertTypeMap = {
	[types.INFO]: alertVariants.INFO,
	[types.SUCCESS]: alertVariants.SUCCESS,
	[types.DANGER]: alertVariants.DANGER,
	[types.WARNING]: alertVariants.WARNING,
}

const StyledToast = styled.div`
	right: 20px;
	position: fixed;
	border-radius: 8px;
	overflow: hidden;
	max-width: calc(100% - 40px);
	transition: all 250ms ease-in;
	width: 100%;
	box-shadow: ${({ theme }) => `0px 10px 20px ${theme.colors.text}40`};

	${({ theme }) => theme.mediaQueries.sm} {
		max-width: 300px;
		right: 12px;
		bottom: 12px;
	}
`

interface ThemedIconLabel {
	variant: AlertProps['variant']
	theme: DefaultTheme
}

const getThemeColor = ({ theme, variant = variants.INFO }: ThemedIconLabel) => {
	switch (variant) {
		case variants.DANGER:
			return theme.colors.failure
		case variants.WARNING:
			return theme.colors.warning
		case variants.SUCCESS:
			return theme.colors.success
		case variants.INFO:
		default:
			return theme.colors.secondary
	}
}

const DisappearInwards = keyframes`
  0% {
		transform: scaleX(100%);
	}
  100% {
		transform: scaleX(0%);
	}
`

const ProgressBar = styled.div<ThemedIconLabel & { hovered: boolean }>`
	display: flex;
	height: 4px;
	width: 100%;
	position: absolute;
	top: 0;
	background: ${getThemeColor};

	animation: ${DisappearInwards} 6s linear forwards;
	animation-play-state: ${({ hovered }) => (hovered ? 'paused' : 'running')};
`

const Toast: React.FC<ToastProps> = ({ toast, onRemove, style, ttl, ...props }) => {
	const timer = useRef<number>()
	const ref = useRef(null)
	const removeHandler = useRef(onRemove)
	const { id, title, description, type, hash, action } = toast

	const handleRemove = useCallback(() => removeHandler.current(id), [id, removeHandler])
	const hashEllipsis = hash ? `${hash.substring(0, 4)}...${hash.substring(hash.length - 4)}` : null
	const { etherscan } = getLinks()
	const txHref = `${etherscan}tx/${hash}`
	const [hovered, setHovered] = useState(false)

	const handleMouseEnter = () => {
		clearTimeout(timer.current)
		setHovered(true)
	}

	const handleMouseLeave = () => {
		if (timer.current) {
			clearTimeout(timer.current)
			setHovered(false)
		}

		timer.current = window.setTimeout(() => {
			handleRemove()
		}, ttl)
	}

	useEffect(() => {
		if (timer.current) {
			clearTimeout(timer.current)
		}

		timer.current = window.setTimeout(() => {
			handleRemove()
		}, ttl)

		return () => {
			clearTimeout(timer.current)
		}
	}, [timer, ttl, handleRemove])

	return (
		<CSSTransition nodeRef={ref} timeout={250} style={style} {...props}>
			<StyledToast ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
				<Alert title={title} variant={alertTypeMap[type]} onClick={handleRemove}>
					{description != null && <Text as='p'>{description}</Text>}
					{hash != null && (
						<RowStart gap='6px'>
							<Text small>Hash:</Text>
							<ExternalLinkButton href={txHref}>{hashEllipsis}</ExternalLinkButton>
						</RowStart>
					)}
					{action && <ToastAction action={action} />}
				</Alert>
				<ProgressBar variant={alertTypeMap[type]} key={`${hovered}`} hovered={hovered} />
			</StyledToast>
		</CSSTransition>
	)
}

export default Toast
