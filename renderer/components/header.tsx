import clsx from 'clsx';
import { ThemeToggle } from './theme-toggle';
import { BlueButtonClass, ButtonSmallClass, GrayButtonClass } from '../utils/class/button_class';

const headerClass = clsx(
	'flex',
	'justify-between',
	'items-stretch',
	'bg-slate-200',
	'dark:bg-[rgb(33,37,41)]',
	'pl-5',
	'pr-5',
	'pt-5',
	'pb-5',
	'select-none',
	'border-b-2',
	'border-white',
	'dark:border-[rgba(255,255,255,0.1)]',
);
const titleClass = clsx(
	'text-4xl',
	'font-bold',
	'underline',
	'text-gray-700',
	'dark:text-gray-300',
);
const buttonClass = clsx('flex', 'justify-end', 'items-center', 'gap-4');

type PropType = {
	title: string;
	buttons?: [
		{
			action: CallableFunction;
			text: string;
			buttonDesignClass: string;
		},
	];
};

export function Header({ title, buttons }: PropType) {
	return (
		<header className={headerClass}>
			<div className={titleClass}>
				<h1>{title}</h1>
			</div>
			<div className={buttonClass}>
				{buttons?.map(({ action, text, buttonDesignClass }) => (
					<button onClick={() => action()} className={clsx(buttonDesignClass, ButtonSmallClass)}>
						{text}
					</button>
				))}
				<ThemeToggle />
			</div>
		</header>
	);
}
