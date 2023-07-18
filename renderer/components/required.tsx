import clsx from 'clsx';
import { useTooltip } from '../hooks/use-tooltip';

const requiredClass = clsx('text-red-500', 'dark:text-rose-400', 'text-bold');

export function RequiredIcon() {
	const { tooltip } = useTooltip();
	return (
		<span className={requiredClass} {...tooltip('Required')}>
			*
		</span>
	);
}
