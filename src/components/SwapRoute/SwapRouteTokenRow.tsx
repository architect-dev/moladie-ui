import TokenIconAndSymbol from '../TokenIconAndSymbol'
import { Text } from '@uikit'

export const SwapRouteTokenRow: React.FC<{ prefix?: string; token?: string }> = ({ prefix, token }) => {
	if (token == null) return null

	return (
		<Text small bold style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
			{prefix != null ? <pre>{prefix}</pre> : ''}
			<TokenIconAndSymbol token={token} center />
		</Text>
	)
}
