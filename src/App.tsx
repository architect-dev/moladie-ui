import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import GlobalStyle from './style/Global'
import styled from 'styled-components'
import Background from '@components/Background'
import Snowflakes from '@components/Snowflakes'
import useEagerConnect from '@hooks/useEagerConnect'
import { ResetCSS } from '@uikit'
import Page from '@components/layout/Page'

const Loser = lazy(() => import('./views/Loser'))
const Home = lazy(() => import('./views/Home'))
const NotFound = lazy(() => import('./views/NotFound'))

const StyledRouter = styled(Router)`
	position: relative;
`

// This config is required for number formatting
BigNumber.config({
	EXPONENTIAL_AT: 1000,
	DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
	useEagerConnect()

	return (
		<StyledRouter>
			<ResetCSS />
			<GlobalStyle />
			<Background />
			<Snowflakes />

			<Page>
				<Suspense>
					<Switch>
						<Route path='/' exact>
							<Home />
						</Route>
						<Route path='/loser' exact>
							<Loser />
						</Route>
						<Route component={NotFound} />
					</Switch>
				</Suspense>
			</Page>
		</StyledRouter>
	)
}

export default React.memo(App)
