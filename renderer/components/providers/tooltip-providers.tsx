import { createContext, useContext, useMemo, useReducer } from 'react';

const Tooltip = createContext<{
	tooltip: string;
	setTooltip: (value?: string) => void;
}>({ tooltip: '', setTooltip: undefined });

function reducer(state: string, action?: string) {
	return action ?? state;
}

export function TooltipProvider({ children }) {
	const [tooltip, setTooltip] = useReducer(reducer, '');
	const tooltipProviderValue = useMemo(() => ({ tooltip, setTooltip }), [tooltip, setTooltip]);

	return <Tooltip.Provider value={tooltipProviderValue}>{children}</Tooltip.Provider>;
}

export function useTooltipContext() {
	return useContext(Tooltip);
}
