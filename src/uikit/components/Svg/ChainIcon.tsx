import React from 'react'
import Svg from './Svg'
import { SvgProps } from './types'

const ftmPath =
	'M147.283 13.605C143.197 11.4592 138.316 11.4653 134.235 13.6215L65.5986 49.8846C65.4574 49.9591 65.3239 50.044 65.1987 50.138L134.414 85.4316C138.398 87.4632 143.113 87.469 147.103 85.4473L216.778 50.136C216.657 50.0475 216.53 49.9673 216.395 49.8965L147.283 13.605ZM218 62.9697L156.739 94.0166L218 126.186V62.9697ZM216.815 139.117L147.283 102.605C147.025 102.469 146.764 102.343 146.5 102.224V174.735C146.703 174.644 146.904 174.548 147.103 174.447L216.815 139.117ZM134.5 174.475V102.485C134.411 102.529 134.323 102.575 134.235 102.621L65.158 139.117L134.414 174.432C134.443 174.446 134.471 174.461 134.5 174.475ZM64 126.157L124.834 94.0164L64 62.9968V126.157ZM64 151.997V229.689C64 230.817 64.6325 231.849 65.6372 232.362L134.414 267.432C138.398 269.463 143.113 269.469 147.103 267.447L216.356 232.35C217.365 231.839 218 230.804 218 229.674V151.97L152.527 185.151C145.119 188.906 136.362 188.895 128.963 185.122L64 151.997ZM128.629 3.01132C136.208 -0.992935 145.273 -1.00437 152.862 2.98076L221.974 39.2723C226.909 41.8638 230 46.9783 230 52.5526V229.674C230 235.326 226.823 240.498 221.781 243.053L152.527 278.151C145.119 281.906 136.362 281.895 128.963 278.122L60.1861 243.052C55.1625 240.49 52 235.328 52 229.689V52.5371C52 46.9765 55.0762 41.8721 59.9928 39.2744L128.629 3.01132ZM240 53.3952C240 40.6566 233.158 32.0922 222.353 26.7796L227.647 16.0109C241.631 22.8863 252 35.1339 252 53.3952H240ZM41 228.395C41 241.134 47.8423 249.698 58.6474 255.011L53.3526 265.78C39.369 258.904 29 246.657 29 228.395H41Z'
const polygonPath =
	'M115.521 74.4531L86.6227 57.4021C80.6814 53.8965 73.3138 53.8717 67.3492 57.3374L37.7481 74.5365C31.8616 77.9567 28.2386 84.2561 28.2386 91.0708V117.955C28.2386 124.848 31.9449 131.207 37.9386 134.598L68.0015 151.606C73.7254 154.844 80.7107 154.906 86.4905 151.768L124.92 130.909L153.158 115.581L193.743 93.551C199.626 90.358 206.748 90.4818 212.517 93.8774L270.584 128.061C276.418 131.495 280 137.764 280 144.54V206.191C280 213.006 276.377 219.305 270.491 222.726L212.503 256.418C206.617 259.838 199.357 259.862 193.448 256.481L134.538 222.766C128.59 219.363 124.92 213.029 124.92 206.169V190.167V185.779L153.158 170.182V174.299V189.762C153.158 196.621 156.829 202.955 162.776 206.358L193.342 223.851C199.25 227.232 206.51 227.209 212.396 223.788L242.252 206.441C248.138 203.021 251.761 196.722 251.761 189.907V160.717C251.761 153.941 248.179 147.672 242.346 144.238L211.953 126.347C206.185 122.951 199.063 122.827 193.18 126.02L153.158 147.744L124.92 163.072L86.2076 184.085C80.4278 187.223 73.4425 187.161 67.7185 183.923L9.69996 151.1C3.7063 147.709 0 141.349 0 134.456V74.7867C0 67.972 3.62299 61.6726 9.50944 58.2524L67.4589 24.582C73.4235 21.1163 80.791 21.1411 86.7323 24.6467L143.759 58.2949C149.583 61.7313 153.158 67.9955 153.158 74.7645V89.7106V94.6805L124.92 110.216V105.454V90.9227C124.92 84.1537 121.345 77.8895 115.521 74.4531Z'

const getPath = (chain: number) => {
	if (chain === 250) return ftmPath
	return polygonPath
}

const BlastIcon: React.FC<SvgProps> = (props) => {
	return (
		<Svg viewBox='0 0 215 215' style={{ zIndex: 3 }} {...props}>
			<path d='M161 106.4L190.3 91.8001L200.4 60.8001L180.2 46.1001H45.7L14.6 69.2001H172.7L164.3 95.2001H100.9L94.8 114.2H158.2L140.4 168.9L170.1 154.2L180.7 121.4L160.8 106.8L161 106.4Z' />
			<path d='M59.3 145.4L77.6 88.4002L57.3 73.2002L26.8 168.9H140.4L148 145.4H59.3Z' />
		</Svg>
	)
}

const Icon: React.FC<SvgProps & { chain?: number }> = ({ chain, ...props }) => {
	if (chain == null) return null
	if (chain == 168587773 || chain == 81457) return <BlastIcon {...props} />

	return (
		<Svg viewBox='0 0 280 280' {...props}>
			<path d={getPath(chain)} />
		</Svg>
	)
}

export default React.memo(Icon)
