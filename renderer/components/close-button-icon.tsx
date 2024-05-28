import clsx from 'clsx';
import { X } from 'lucide-react';

export function CloseButtonIcon() {
	return (
		<X
			className={clsx(
				'transition-colors',
				'hover:text-neutral-500',
				'active:text-neutral-300',
				'dark:hover:text-neutral-400',
				'dark:active:text-neutral-600',
			)}
		/>
	);
}
