import clsx from 'clsx';

export const LabelLeftClass = clsx('text-right', 'py-1', 'px-0.5', 'ml-2', 'mr-1');

export const LabelTopClass = clsx('text-left', 'py-1', 'px-0.5');

export const TextBoxClass = clsx(
	'py-1',
	'px-2',
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

export const TextBoxRightClass = clsx(TextBoxClass, 'ml-1', 'mr-2');

export const TextBoxBottomClass = clsx(TextBoxClass, 'mb-3');

export const InputTextClass = clsx(
	'flex-1',
	'text-left',
	'px-1',
	'bg-transparent',
	'focus:outline-none',
);

export const DisabledTextBoxClass = clsx(
	'py-1',
	'px-2',
	'text-gray-600',
	'dark:text-gray-400',
	'border-2',
	'border-gray-300',
	'dark:border-gray-800',
	'bg-gray-200',
	'dark:bg-gray-700',
	'transition-[border-color]',
	'rounded-md',
);

export const DisabledTextBoxRightClass = clsx(DisabledTextBoxClass, 'ml-1', 'mr-2');

export const DisabledTextBoxBottomClass = clsx(DisabledTextBoxClass, 'mb-3');

export const InvalidTextBoxClass = clsx(
	'error',
	'!text-red-600',
	'dark:!text-red-400',
	'!border-red-400',
	'dark:!border-red-600',
	'!bg-red-50',
	'dark:!bg-red-950',
);

export const ErrorTextBoxClass = clsx('error');

export const TextAreaNoResizeClass = clsx('resize-none');

export const DropdownClass = clsx(
	'absolute',
	'z-50',
	'top-9',
	'-mx-2',
	'w-full',
	'max-h-[200px]',
	'bg-slate-100',
	'dark:bg-slate-900',
	'border-x-2',
	'border-b-2',
	'border-gray-300',
	'dark:border-gray-500',
	'rounded-b-md',
	'overflow-auto',
);

export const DropdownTableClass = clsx('w-full');

export const DropdownRowClass = clsx(
	'text-black',
	'dark:text-white',
	'h-[30px]',
	'hover:bg-slate-200',
	'dark:hover:bg-slate-800',
	'active:bg-slate-300',
	'dark:active:bg-slate-700',
	'hover:cursor-pointer',
);

export const DropdownSelectedRow = clsx('font-bold', 'bg-slate-200', 'dark:bg-slate-800');

export const DropdownCellClass = clsx('px-3', 'select-none');
