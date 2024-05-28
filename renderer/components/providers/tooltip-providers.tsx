import React, { createContext, useContext, useMemo, useReducer } from 'react';

const Tooltip = createContext<{
	tooltip: string;
	setTooltip: (value?: string) => void;
}>({ tooltip: '', setTooltip: undefined });

function reducer(state: string, action?: string) {
	return action ?? state;
}

type PropType = {
	children: React.ReactNode;
};

export function TooltipProvider({ children }: Readonly<PropType>) {
	const [tooltip, setTooltip] = useReducer<React.Reducer<string, string>>(reducer, '');
	const tooltipProviderValue = useMemo(() => ({ tooltip, setTooltip }), [tooltip, setTooltip]);

	return <Tooltip.Provider value={tooltipProviderValue}>{children}</Tooltip.Provider>;
}

export function useTooltipContext() {
	return useContext(Tooltip);
}
