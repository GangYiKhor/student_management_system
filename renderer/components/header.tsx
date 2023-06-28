import clsx from 'clsx';
import { ThemeToggle } from './theme-toggle';

const headerClass = clsx(
	'flex',
	'justify-between',
	'bg-slate-100',
	'dark:bg-[rgb(33,37,41)]',
	'text-4xl',
	'font-bold',
	'underline',
	'pl-5',
	'pr-5',
	'pt-5',
	'pb-5',
	'select-none',
	'text-gray-700',
	'dark:text-gray-300',
	'border-b-4',
	'border-white',
	'dark:border-gray-600',
);
const buttonClass = clsx('flex', 'justify-end', 'gap-4');

type PropType = {
	title: string;
	buttons?: {
		action: CallableFunction;
		text: string;
	};
};

export function Header({ title, buttons }: PropType) {
	return (
		<header className={headerClass}>
			<div>
				<h1>{title}</h1>
			</div>
			<div>
				<ThemeToggle />
			</div>
		</header>
	);
}
