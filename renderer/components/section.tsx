import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ReactNode, useState } from 'react';

const buttonClass = clsx(
	'w-full',
	'flex',
	'justify-between',
	'items-center',
	'p-2',
	'pl-4',
	'mt-2',
	'rounded-t-lg',
	'bg-[rgba(0,0,0,0.05)]',
	'dark:bg-[rgba(255,255,255,0.1)]',
);

const hoverButtonClass = clsx(
	'hover:bg-[rgba(0,0,0,0.1)]',
	'dark:hover:bg-[rgba(255,255,255,0.15)]',
	'transition-all',
	'duration-150',
);

const titleClass = clsx('font-bold', 'text-lg', 'text-neutral-700', 'dark:text-neutral-200');
const contentClass = clsx(
	'px-4',
	'rounded-b-lg',
	'bg-[rgba(0,0,0,0.05)]',
	'dark:bg-[rgba(255,255,255,0.1)]',
);

type PropType = {
	title?: string;
	hideable?: boolean;
	defaultHide?: boolean;
	children?: ReactNode;
};

export function Section({ title, hideable, defaultHide, children }: Readonly<PropType>) {
	const [hidden, setHidden] = useState(defaultHide ?? false);

	const getChevron = () => {
		if (hideable) {
			return hidden ? <ChevronUp /> : <ChevronDown />;
		}
	};

	return (
		<div>
			<button
				className={clsx(
					buttonClass,
					hideable ? hoverButtonClass : 'cursor-default',
					hideable && hidden && 'rounded-b-lg',
				)}
				disabled={!hideable}
				onClick={() => hideable && setHidden(!hidden)}
			>
				<span className={titleClass}>{title}</span>
				{getChevron()}
			</button>
			<div className={clsx(hideable && hidden && 'hidden', contentClass)}>{children}</div>
		</div>
	);
}
