import clsx from 'clsx';

export const DefaultButtonClass = clsx('hover:cursor-pointer', 'select-none');
export const ButtonXSmallClass = clsx('p-1', 'rounded-full');
export const ButtonSmallClass = clsx('pt-2', 'pb-2', 'pl-4', 'pr-4', 'rounded-lg');

export const EmptyLightButtonClass = clsx(
	'hover:bg-[rgba(0,0,0,0.1)]',
	'active:bg-[rgba(0,0,0,0.2)]',
	'dark:hover:bg-[rgba(255,255,255,0.3)]',
	'dark:active:bg-[rgba(255,255,255,0.5)]',
	'hover:shadow-lg',
	DefaultButtonClass,
);

export const EmptyDarkButtonClass = clsx(
	'dark:hover:bg-[rgba(0,0,0,0.1)]',
	'dark:active:bg-[rgba(0,0,0,0.2)]',
	'hover:bg-[rgba(255,255,255,0.3)]',
	'active:bg-[rgba(255,255,255,0.5)]',
	'hover:shadow-lg',
	DefaultButtonClass,
);

export const GreenButtonClass = clsx(
	'text-white',
	'bg-[rgb(25,135,84)]',
	'hover:bg-[rgb(21,115,71)]',
	'active:bg-[rgb(20,108,67)]',
	'hover:shadow-lg',
	'transition-colors',
	'duration-200',
	DefaultButtonClass,
	ButtonSmallClass,
);

export const BlueButtonClass = clsx(
	'text-white',
	'bg-[rgb(13,110,253)]',
	'hover:bg-[rgb(11,94,215)]',
	'active:bg-[rgb(10,88,202)]',
	'hover:shadow-lg',
	'transition-colors',
	'duration-200',
	DefaultButtonClass,
	ButtonSmallClass,
);

export const GrayButtonClass = clsx(
	'text-white',
	'bg-[rgb(108,117,125)]',
	'hover:bg-[rgb(92,99,106)]',
	'active:bg-[rgb(86,94,100)]',
	'hover:shadow-lg',
	'transition-colors',
	'duration-200',
	DefaultButtonClass,
	ButtonSmallClass,
);

export const RedButtonClass = clsx(
	'text-white',
	'bg-[rgb(220,53,69)]',
	'hover:bg-[rgb(187,45,59)]',
	'active:bg-[rgb(176,42,55)]',
	'hover:shadow-lg',
	'transition-colors',
	'duration-200',
	DefaultButtonClass,
	ButtonSmallClass,
);

export const WhiteButtonClass = clsx(
	'text-black',
	'bg-[rgb(245,245,245)]',
	'hover:bg-[rgb(211,212,213)]',
	'active:bg-[rgb(198,199,200)]',
	'border',
	'hover:shadow-lg',
	'transition-colors',
	'duration-200',
	DefaultButtonClass,
	ButtonSmallClass,
);

export const BlackButtonClass = clsx(
	'text-white',
	'bg-[rgb(0,0,0)]',
	'hover:bg-[rgb(66,70,73)]',
	'active:bg-[rgb(77,81,84)]',
	'hover:shadow-lg',
	'transition-colors',
	'duration-200',
	DefaultButtonClass,
	ButtonSmallClass,
);

export const WhiteBlackButtonClass = clsx(
	'text-black',
	'bg-[rgb(245,245,245)]',
	'hover:bg-[rgb(211,212,213)]',
	'active:bg-[rgb(198,199,200)]',
	'dark:text-white',
	'dark:bg-[rgb(0,0,0)]',
	'dark:hover:bg-[rgb(66,70,73)]',
	'dark:active:bg-[rgb(77,81,84)]',
	'border',
	'border-slate-300',
	'dark:border-slate-800',
	'hover:shadow-lg',
	'transition-colors',
	'duration-200',
	DefaultButtonClass,
	ButtonSmallClass,
);
