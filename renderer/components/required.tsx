import clsx from 'clsx';
import { useTooltip } from '../hooks/use-tooltip';

const requiredClass = clsx('text-red-500', 'dark:text-rose-400', 'text-bold');

type PropType = {
	required?: boolean;
};

export function RequiredIcon({ required }: Readonly<PropType>) {
	const { tooltip } = useTooltip();
	return required ? (
		<span className={requiredClass} {...tooltip('Required')}>
			*
		</span>
	) : null;
}
