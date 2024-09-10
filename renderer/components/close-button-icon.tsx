import clsx from 'clsx';
import { X } from 'lucide-react';

type PropType = {
	disabled?: boolean;
};

export function CloseButtonIcon({ disabled }: Readonly<PropType>) {
	return (
		<X
			className={clsx(
				'transition-colors',
				disabled
					? ''
					: clsx(
							'hover:text-neutral-500',
							'active:text-neutral-300',
							'dark:hover:text-neutral-400',
							'dark:active:text-neutral-600',
						),
			)}
		/>
	);
}
