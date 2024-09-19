import clsx from 'clsx';
import { ThemeToggle } from './theme-toggle';

const headerClass = clsx(
	'flex justify-between items-center',
	'bg-slate-200 dark:bg-[rgb(33,37,41)]',
	'select-none p-5',
);
const titleClass = clsx('text-4xl font-bold underline', 'text-gray-700 dark:text-gray-300');

type PropType = {
	title: string;
};

export function Header({ title }: Readonly<PropType>) {
	return (
		<header className={headerClass}>
			<h1 className={titleClass}>{title}</h1>
			<ThemeToggle />
		</header>
	);
}
