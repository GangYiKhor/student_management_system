import clsx from 'clsx';

export const TableClass = clsx(
	'table-auto',
	'w-full',
	'border-b-2',
	'border-t-2',
	'border-gray-500',
);

export const THeadClass = clsx('border-b-2', 'border-gray-500', 'bg-slate-200', 'dark:bg-black');
export const THeadStickyClass = clsx('sticky', 'top-[-2px]', 'border-t-0');

export const THeadHoverClass = clsx(
	'hover:bg-[rgba(0,0,0,0.05)]',
	'active:bg-[rgba(0,0,0,0.1)]',
	'dark:hover:bg-[rgba(255,255,255,0.05)]',
	'dark:active:bg-[rgba(255,255,255,0.1)]',
);

export const THeadClassWithHover = clsx(THeadClass, THeadHoverClass);

export const THeadCellClass = clsx('py-3', 'pl-4', 'pr-5', 'text-center');
export const CellClass = clsx('py-1', 'pl-4', 'pr-5', 'text-center');

export const NormalRowHoverClass = clsx(
	'hover:bg-[rgba(0,0,0,0.05)]',
	'active:bg-[rgba(0,0,0,0.1)]',
	'dark:hover:bg-[rgba(255,255,255,0.1)]',
	'dark:active:bg-[rgba(255,255,255,0.2)]',
);

export const AlternateRowClass = clsx('bg-neutral-200', 'dark:bg-neutral-700');

export const AlternateRowHoverClass = clsx(
	'hover:bg-neutral-300',
	'active:bg-neutral-400',
	'dark:hover:bg-neutral-600',
	'dark:active:bg-neutral-500',
);

export const AlternateRowClassWithHover = clsx(AlternateRowClass, AlternateRowHoverClass);

export const RedRowClass = clsx('bg-red-200', 'dark:bg-red-700');

export const RedRowHoverClass = clsx(
	'hover:bg-red-300',
	'active:bg-red-400',
	'dark:hover:bg-red-600',
	'dark:active:bg-red-500',
);

export const RedRowClassWithHover = clsx(RedRowClass, RedRowHoverClass);

export const GreenRowClass = clsx('bg-green-300', 'dark:bg-green-800');

export const GreenRowHoverClass = clsx(
	'hover:bg-green-400',
	'active:bg-green-500',
	'dark:hover:bg-green-700',
	'dark:active:bg-green-600',
);

export const GreenRowClassWithHover = clsx(GreenRowClass, GreenRowHoverClass);
