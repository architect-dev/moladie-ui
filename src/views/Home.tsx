import React from 'react'
import { Column, ExternalLinkButton, Row, RowCenter, SummitButton, Text } from '@uikit'
import { useAtom } from 'jotai'
import { calmAtom, shake } from '@components/Background'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const ShakeWrapper = styled.div<{ calm: boolean }>`
	animation: ${shake} ${({ calm }) => (calm ? 4 : 0.2)}s infinite;
	display: flex;
	align-items: center;
	justify-content: center;
`

const Home: React.FC = () => {
	const [calm, setCalm] = useAtom(calmAtom)
	return (
		<>
			<Text fontSize='32px' letterSpacing='32px'>
				<pre> MOLADIE</pre>
			</Text>
			<RowCenter gap='18px'>
				<ExternalLinkButton fontWeight='bold' href='https://t.me/moladiesol'>
					TELEGRAM
				</ExternalLinkButton>
				<Text>/</Text>
				<ExternalLinkButton fontWeight='bold' href='https://twitter.com/moladiesolana'>
					TWITTER
				</ExternalLinkButton>
				<Text>/</Text>
				<ExternalLinkButton fontWeight='bold' href='https://dexscreener.com/solana/8fafrhffr6plomzssfeu28pwy1jae2gygppvvgg5kusf'>
					SCREENER
				</ExternalLinkButton>
			</RowCenter>
			<br />
			<br />
			<br />
			<br />
			<br />
			<ShakeWrapper calm={!calm} onMouseEnter={() => setCalm(true)} onMouseLeave={() => setCalm(false)}>
				<svg width={293 / 1.75} height={124 / 1.75} viewBox='0 0 293 124' fill='none' xmlns='http://www.w3.org/2000/svg'>
					<g clip-path='url(#clip0_3539_262)'>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M70.5005 10.5002C66.1885 9.84525 62.1885 8.34525 58.5005 6.00025C55.1675 5.33325 51.8335 5.33325 48.5005 6.00025C55.0685 8.78525 61.7355 11.2852 68.5005 13.5002C81.9065 26.3462 85.7405 41.6803 80.0005 59.5003C69.7155 67.8933 58.2155 74.0603 45.5005 78.0003C40.5005 78.6673 35.5005 78.6673 30.5005 78.0003C28.3935 76.7363 27.3935 74.9033 27.5005 72.5003C28.8335 72.5003 30.1675 72.5003 31.5005 72.5003C32.9785 72.7623 34.3115 72.4293 35.5005 71.5003C29.4675 66.0583 23.3005 60.7253 17.0005 55.5003C13.4665 44.9883 10.6335 34.3212 8.50047 23.5002C7.81147 22.2262 6.97747 22.2262 6.00047 23.5002C5.66747 25.5002 5.33347 27.5002 5.00047 29.5002C1.34147 31.0202 -0.158529 29.6872 0.500471 25.5002C3.52547 17.9713 8.85947 12.4712 16.5005 9.00025C12.1025 9.59225 10.1025 7.75925 10.5005 3.50025C18.8385 2.83425 27.1725 2.00125 35.5005 1.00025C43.8335 0.33325 52.1675 0.33325 60.5005 1.00025C65.4495 1.80825 69.1165 4.30825 71.5005 8.50025C71.4575 9.41625 71.1245 10.0832 70.5005 10.5002Z'
							fill='#070607'
						/>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M52.5 17.5004C49.215 17.2104 46.215 17.8774 43.5 19.5004C43.953 18.5424 44.619 17.7084 45.5 17.0004C48.039 16.2044 50.372 16.3714 52.5 17.5004Z'
							fill='#9F9F9F'
						/>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M52.5 17.4995C60.656 19.1835 63.656 23.8495 61.5 31.4995C57.192 32.6495 52.859 32.6495 48.5 31.4995C43.878 30.2115 40.878 27.2115 39.5 22.4995C40.283 20.7115 41.616 19.7115 43.5 19.4995C46.215 17.8765 49.215 17.2095 52.5 17.4995Z'
							fill='#F3F3F3'
						/>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M48.5 31.5C52.859 32.65 57.192 32.65 61.5 31.5C61.389 32.117 61.056 32.617 60.5 33C56.194 33.912 52.194 33.412 48.5 31.5Z'
							fill='#8D8D8D'
						/>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M256.501 42.5002C265.938 48.0582 275.272 53.8912 284.501 60.0002C286.972 62.8082 289.472 65.6413 292.001 68.5003C292.668 70.5003 292.668 72.5003 292.001 74.5003C290.507 75.7473 289.007 75.7473 287.501 74.5003C286.736 70.0683 284.403 66.7353 280.501 64.5003C278.541 62.8443 276.541 61.1772 274.501 59.5002C273.792 58.5962 272.792 58.2632 271.501 58.5002C271.501 60.5002 271.501 62.5003 271.501 64.5003C270.994 70.2043 270.161 75.8713 269.001 81.5003C266.501 85.3333 263.334 88.5003 259.501 91.0003C253.401 94.0493 247.067 96.5493 240.501 98.5003C239.079 98.7093 237.746 99.2093 236.501 100C239.147 100.497 241.814 100.664 244.501 100.5C245.168 100.5 245.501 100.833 245.501 101.5C245.671 102.822 245.338 103.989 244.501 105C222.095 104.517 203.262 96.0173 188.001 79.5003C185.855 75.5253 184.021 71.5253 182.501 67.5003C175.979 49.3743 181.979 37.8743 200.501 33.0002C206.501 32.3332 212.501 32.3332 218.501 33.0002C231.341 35.5432 244.007 38.7102 256.501 42.5002Z'
							fill='#070606'
						/>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M218.5 24.5C231.327 27.1 243.993 30.6 256.5 35C257.406 36.699 257.739 38.533 257.5 40.5C239.382 35.221 221.048 30.721 202.5 27C197.511 26.501 192.511 26.334 187.5 26.5C185.353 25.068 185.02 23.235 186.5 21C188.833 20.833 191.167 20.667 193.5 20.5C201.828 21.832 210.162 23.165 218.5 24.5Z'
							fill='#130F0E'
						/>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M15.5 27.4999C17.288 27.2149 18.955 27.5479 20.5 28.4999C22.108 33.6579 24.108 38.6579 26.5 43.4999C27.48 46.0859 27.813 48.7529 27.5 51.4999C26.022 51.7619 24.689 51.4289 23.5 50.4999C22.774 47.3789 21.274 44.7129 19 42.4999C16.886 37.7719 15.719 32.7719 15.5 27.4999Z'
							fill='#576C84'
						/>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M232.5 57.5C230.898 55.926 228.898 55.259 226.5 55.5C224.689 55.428 223.356 54.595 222.5 53C221.717 51.05 220.717 49.217 219.5 47.5C219.667 46.833 219.833 46.167 220 45.5C223.347 43.613 226.847 41.946 230.5 40.5C235.924 42.044 241.258 43.878 246.5 46C247.833 49.333 247.833 52.667 246.5 56C241.844 56.665 237.177 57.165 232.5 57.5Z'
							fill='#F0F0F0'
						/>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M27.5 54.5C30.518 54.335 33.518 54.502 36.5 55C38.343 59.154 37.009 61.154 32.5 61C29.466 59.809 27.799 57.642 27.5 54.5Z'
							fill='#E0E0E1'
						/>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M226.5 55.5001C228.898 55.2591 230.898 55.9261 232.5 57.5001C230.102 57.7411 228.102 57.0741 226.5 55.5001Z'
							fill='#A0A0A0'
						/>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M274.5 59.4997C272.972 60.8017 271.972 62.4687 271.5 64.4997C271.5 62.4997 271.5 60.4997 271.5 58.4997C272.791 58.2627 273.791 58.5957 274.5 59.4997Z'
							fill='#7C7C7D'
						/>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M8.5 23.5C10.633 34.321 13.466 44.988 17 55.5C23.3 60.725 29.467 66.058 35.5 71.5C34.311 72.429 32.978 72.762 31.5 72.5C27.878 70.241 24.378 67.575 21 64.5C16.667 58.833 12.333 53.167 8 47.5C6.062 42.981 4.562 38.315 3.5 33.5C5.571 30.3 7.237 26.967 8.5 23.5Z'
							fill='#EDEBE9'
						/>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M37.5 60.5002C39.681 60.2842 41.347 61.1172 42.5 63.0002C47.489 63.4992 52.489 63.6662 57.5 63.5002C57.714 65.1442 57.38 66.6442 56.5 68.0002C51.833 68.6672 47.167 68.6672 42.5 68.0002C37.662 67.3642 35.996 64.8642 37.5 60.5002Z'
							fill='#597189'
						/>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M185.5 64.4997C187.467 64.2607 189.301 64.5937 191 65.4997C191.29 68.4427 192.456 70.9427 194.5 72.9997C192.05 76.2917 189.55 76.1247 187 72.4997C185.921 69.9367 185.421 67.2707 185.5 64.4997Z'
							fill='#556A82'
						/>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M202.5 77.5002C208.158 76.6792 209.825 78.8462 207.5 84.0002C204.15 86.2192 201.483 85.5522 199.5 82.0002C200.315 80.3572 201.315 78.8572 202.5 77.5002Z'
							fill='#D5D6D6'
						/>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M208.501 86.5C218.982 89.092 229.649 90.092 240.501 89.5C240.715 91.144 240.381 92.644 239.501 94C229.298 95.206 219.298 94.372 209.501 91.5C208.549 89.955 208.216 88.288 208.501 86.5Z'
							fill='#5A718C'
						/>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M274.5 59.5C276.54 61.177 278.54 62.844 280.5 64.5C279.995 70.682 278.662 76.682 276.5 82.5C272.169 86.662 267.669 90.662 263 94.5C257.809 98.376 251.976 100.709 245.5 101.5C245.5 100.833 245.167 100.5 244.5 100.5C243.167 99.833 241.833 99.167 240.5 98.5C247.066 96.549 253.4 94.049 259.5 91C263.333 88.5 266.5 85.333 269 81.5C270.16 75.871 270.993 70.204 271.5 64.5C271.972 62.469 272.972 60.802 274.5 59.5Z'
							fill='#F0EFEE'
						/>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M240.5 98.5C241.833 99.167 243.167 99.833 244.5 100.5C241.813 100.664 239.146 100.497 236.5 100C237.745 99.209 239.078 98.709 240.5 98.5Z'
							fill='#505355'
						/>
						<path
							fill-rule='evenodd'
							clip-rule='evenodd'
							d='M99.4999 110.5C100.873 110.343 102.207 110.51 103.5 111C104.056 113.237 105.056 115.237 106.5 117C112.5 118.5 116 118.5 125.5 115.5C129 117 126.007 120.67 122.5 122C117.5 122.667 110.5 123.667 105.5 123C103.359 121.692 101.359 120.192 99.4999 118.5C98.2709 115.801 98.2709 113.135 99.4999 110.5Z'
							fill='#15110F'
						/>
					</g>
					<defs>
						<clipPath id='clip0_3539_262'>
							<rect width='293' height='124' fill='white' />
						</clipPath>
					</defs>
				</svg>
			</ShakeWrapper>

			<br />
			<br />
			<br />
			<br />
			<br />
			<Text bold>Contract:</Text>
			<Text bold>AZju2nH79ucxnvRUXweVZQ86ZKUkP1Ho8rMTmmkHo2kV</Text>

			<br />
			<br />
			<br />
			<br />
			<br />
			<Row alignItems='flex-start' justifyContent='center' gap='32px'>
				<Column alignItems='flex-start' marginBottom='auto'>
					<Text bold fontSize='15px'>
						Hall of Fame (Biggest Sellers)
					</Text>
					<Text bold gold>
						<br />
						<br />
						CUERPpk8XTrXm6p5kgxPANcPkByhw463dT6dTUezmTjW
						<br />
						21,797,800.38
						<br />
						9uLwEPRcUzrKNpBdKCMkYubRqd8ybgJVX2A9de71f9ba
						<br />
						34,251,772.22
						<br />
						5k96ohUq3DLVfbWovNn21qZKWEZWLT3DHuK2JA6E3qME
						<br />
						12,625,541.96
						<br />
						FsxmYNv5ymeS37dQVejQvhqYKN2yiPft2Vtzbu553dYQ
						<br />
						18,591,652.49
						<br />
						Bwns4XThmkkitf3sEkot49z9QSMamxtLVKUMqu3V7t6z
						<br />
						24,290,397.82
						<br />
						<br />
					</Text>
					<SummitButton as={Link} to='/loser' style={{ flex: 0, marginRight: 'auto' }}>
						JOIN HALL OF FAME
					</SummitButton>
				</Column>
				<Column alignItems='flex-end' marginBottom='auto'>
					<Text bold fontSize='15px'>
						Wall of Shame (Biggest Buyers)
					</Text>
					<Text bold red textAlign='right'>
						<br />
						<br />
						7VTE9itH9ZQ6yVxZPQT6gQP2TJ5DwVgu7AG87nao4vFK
						<br />
						34,311,844.18
						<br />
						8ig36i7JK9hkA7WvkEELvtXQuXCipsZeWkp97EEUF1Cy
						<br />
						12,467,542.41
						<br />
						H3v16mi1FtSFCin9iSX1sHvNhNNmddTFiBHu5bUgyiDv
						<br />
						18,591,652.49
						<br />
						<br />
						<br />
						<br />
						<br />
						<br />
					</Text>
					<SummitButton as={Link} to='/loser' style={{ flex: 0, marginLeft: 'auto' }}>
						JOIN WALL OF SHAME
					</SummitButton>
				</Column>
			</Row>

			<br />
			<br />
			<br />
			<br />
			<br />
			<Text bold>
				FAQ:
				<br />
				<br />
				Q: How to participate?
				<br />
				A: Participate
				<br />
				<br />
				Q: Whats the price?
				<br />
				A: Lower than when you bought
				<br />
				<br />
				Q: Are devs anon?
				<br />
				A: Devs? `
			</Text>
		</>
	)
}

export default Home
