import React, { useState, useEffect, ReactNode } from 'react'

const FAST_INTERVAL = 2000
const MID_INTERVAL = 6000
const SLOW_INTERVAL = 60000

const RefreshContext = React.createContext({ slow: 0, mid: 0, fast: 0 })

// This context maintain 2 counters that can be used as a dependencies on other hooks to force a periodic refresh
const RefreshContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [slow, setSlow] = useState(0)
	const [mid, setMid] = useState(0)
	const [fast, setFast] = useState(0)

	useEffect(() => {
		const interval = setInterval(async () => {
			setFast((prev) => prev + 1)
		}, FAST_INTERVAL)
		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		const interval = setInterval(async () => {
			setMid((prev) => prev + 1)
		}, MID_INTERVAL)
		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		const interval = setInterval(async () => {
			setSlow((prev) => prev + 1)
		}, SLOW_INTERVAL)
		return () => clearInterval(interval)
	}, [])

	return <RefreshContext.Provider value={{ slow, mid, fast }}>{children}</RefreshContext.Provider>
}

export { RefreshContext, RefreshContextProvider }
