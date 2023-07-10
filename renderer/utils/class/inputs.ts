import clsx from 'clsx';

export const LabelLeftClass = clsx(
	'text-right',
	'pt-[4px]',
	'pb-[4px]',
	'pl-[2px]',
	'pr-[2px]',
	'ml-2',
	'mr-2',
);

export const LabelTopClass = clsx('text-left', 'pt-[4px]', 'pb-[4px]', 'pl-[2px]', 'pr-[2px]');

export const TextBoxClass = clsx(
	'pt-[4px]',
	'pb-[4px]',
	'pl-[8px]',
	'pr-[8px]',
	'border-2',
	'border-gray-300',
	'hover:border-gray-500',
	'dark:border-gray-500',
	'dark:hover:border-gray-300',
	'bg-gray-100',
	'focus:bg-white',
	'dark:bg-bgdark',
	'dark:focus:bg-black',
	'transition-[border-color]',
	'rounded-md',
);

export const TextBoxRightClass = clsx(TextBoxClass, 'ml-2', 'mr-2');

export const TextBoxBottomClass = clsx(TextBoxClass, 'mb-3');

export const DisabledTextBoxClass = clsx(
	'pt-[4px]',
	'pb-[4px]',
	'pl-[8px]',
	'pr-[8px]',
	'text-gray-600',
	'dark:text-gray-400',
	'border-2',
	'border-gray-300',
	'dark:border-gray-800',
	'bg-gray-200',
	'dark:bg-gray-700',
	'transition-[border-color]',
	'rounded-md',
	'select-none',
);

export const InvalidTextBoxClass = clsx(
	'!text-red-600',
	'dark:!text-red-400',
	'!border-red-400',
	'dark:!border-red-600',
	'!bg-red-50',
	'dark:!bg-red-950',
);

export const ErrorTextBoxClass = clsx('error');
