import clsx from 'clsx';

export const DefaultButtonClass = clsx(
	'hover:cursor-pointer',
	'hover:shadow-lg',
	'disabled:hover:cursor-not-allowed',
	'disabled:shadow-none',
	'disabled:opacity-50',
	'select-none',
	'transition-colors',
	'duration-100',
);
export const ButtonRoundClass = clsx('p-1', 'rounded-full');
export const ButtonXSClass = clsx('py-1', 'px-4', 'rounded-xl');
export const ButtonSmallClass = clsx('py-2', 'px-4', 'rounded-lg');

const EmptyColours = clsx(
	'hover:bg-[rgba(0,0,0,0.1)]',
	'active:bg-[rgba(0,0,0,0.2)]',
	'dark:hover:bg-[rgba(255,255,255,0.3)]',
	'dark:active:bg-[rgba(255,255,255,0.5)]',
	'disabled:hover:bg-transparent',
	'disabled:active:bg-transparent',
	'disabled:dark:hover:bg-transparent',
	'disabled:dark:active:bg-transparent',
);

const GreenColours = clsx(
	'text-white',
	'bg-[rgb(25,135,84)]',
	'hover:bg-[rgb(21,115,71)]',
	'active:bg-[rgb(20,108,67)]',
	'disabled:hover:bg-[rgb(25,135,84)]',
	'disabled:active:bg-[rgb(25,135,84)]',
);

const BlueColours = clsx(
	'text-white',
	'bg-[rgb(13,110,253)]',
	'hover:bg-[rgb(11,94,215)]',
	'active:bg-[rgb(10,88,202)]',
	'disabled:hover:bg-[rgb(13,110,253)]',
	'disabled:active:bg-[rgb(13,110,253)]',
);

const GrayColours = clsx(
	'text-white',
	'bg-[rgb(108,117,125)]',
	'hover:bg-[rgb(92,99,106)]',
	'active:bg-[rgb(86,94,100)]',
	'disabled:hover:bg-[rgb(108,117,125)]',
	'disabled:active:bg-[rgb(108,117,125)]',
);

const RedColours = clsx(
	'text-white',
	'bg-[rgb(220,53,69)]',
	'hover:bg-[rgb(187,45,59)]',
	'active:bg-[rgb(176,42,55)]',
	'disabled:hover:bg-[rgb(220,53,69)]',
	'disabled:active:bg-[rgb(220,53,69)]',
);

const WhiteColours = clsx(
	'text-black',
	'bg-[rgb(245,245,245)]',
	'hover:bg-[rgb(211,212,213)]',
	'active:bg-[rgb(198,199,200)]',
	'disabled:hover:bg-[rgb(245,245,245)]',
	'disabled:active:bg-[rgb(245,245,245)]',
	'border',
);

const BlackColours = clsx(
	'text-white',
	'bg-[rgb(0,0,0)]',
	'hover:bg-[rgb(66,70,73)]',
	'active:bg-[rgb(77,81,84)]',
	'disabled:hover:bg-[rgb(0,0,0)]',
	'disabled:active:bg-[rgb(0,0,0)]',
);

const WhiteBlackColours = clsx(
	'text-black',
	'bg-[rgb(245,245,245)]',
	'hover:bg-[rgb(211,212,213)]',
	'active:bg-[rgb(198,199,200)]',
	'disabled:hover:bg-[rgb(245,245,245)]',
	'disabled:active:bg-[rgb(245,245,245)]',
	'dark:text-white',
	'dark:bg-[rgb(0,0,0)]',
	'dark:hover:bg-[rgb(66,70,73)]',
	'dark:active:bg-[rgb(77,81,84)]',
	'disabled:dark:hover:bg-[rgb(0,0,0)]',
	'disabled:dark:active:bg-[rgb(0,0,0)]',
	'border',
	'border-slate-300',
	'dark:border-slate-800',
);

export const EmptyLightButtonClass = clsx(EmptyColours, DefaultButtonClass);

export const GreenXSButtonClass = clsx(GreenColours, DefaultButtonClass, ButtonXSClass);
export const GreenButtonClass = clsx(GreenColours, DefaultButtonClass, ButtonSmallClass);

export const BlueXSButtonClass = clsx(BlueColours, DefaultButtonClass, ButtonXSClass);
export const BlueButtonClass = clsx(BlueColours, DefaultButtonClass, ButtonSmallClass);

export const GrayXSButtonClass = clsx(GrayColours, DefaultButtonClass, ButtonXSClass);
export const GrayButtonClass = clsx(GrayColours, DefaultButtonClass, ButtonSmallClass);

export const RedXSButtonClass = clsx(RedColours, DefaultButtonClass, ButtonXSClass);
export const RedButtonClass = clsx(RedColours, DefaultButtonClass, ButtonSmallClass);

export const WhiteXSButtonClass = clsx(WhiteColours, DefaultButtonClass, ButtonXSClass);
export const WhiteButtonClass = clsx(WhiteColours, DefaultButtonClass, ButtonSmallClass);

export const BlackXSButtonClass = clsx(BlackColours, DefaultButtonClass, ButtonXSClass);
export const BlackButtonClass = clsx(BlackColours, DefaultButtonClass, ButtonSmallClass);

export const WhiteBlackXSButtonClass = clsx(WhiteBlackColours, DefaultButtonClass, ButtonXSClass);
export const WhiteBlackButtonClass = clsx(WhiteBlackColours, DefaultButtonClass, ButtonSmallClass);
