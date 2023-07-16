import clsx from 'clsx';

const requiredClass = clsx('text-red-500', 'dark:text-rose-400', 'text-bold');

export function RequiredIcon() {
	return <span className={requiredClass}>*</span>;
}
