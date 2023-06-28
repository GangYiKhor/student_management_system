import clsx from 'clsx';

export const defaultButtonClass = clsx(
	'hover:bg-[rgba(0,0,0,0.1)]',
	'active:bg-[rgba(0,0,0,0.2)]',
	'dark:hover:bg-[rgba(255,255,255,0.3)]',
	'dark:active:bg-[rgba(255,255,255,0.5)]',
	'hover:cursor-pointer',
	'select-none',
);
