import { useContext } from 'react'
import { RefreshContext } from '@contexts/RefreshContext'

const useRefresh = () => {
	const { fast, mid, slow } = useContext(RefreshContext)
	return { fastRefresh: fast, midRefresh: mid, slowRefresh: slow }
}

export default useRefresh
