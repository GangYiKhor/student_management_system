import { useTooltipContext } from '../components/providers/tooltip-providers';

export const useTooltip = () => {
	const { setTooltip } = useTooltipContext();
	const tooltip = (tooltip: string) => ({
		onMouseOver: () => setTooltip(tooltip),
		onMouseLeave: () => setTooltip(''),
	});
	return { tooltip };
};
