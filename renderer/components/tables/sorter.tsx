import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCallback } from 'react';

const containerClass = clsx('flex', 'justify-center');
const sorterClass = clsx('flex', 'flex-col', 'ml-2');

type PropType = {
	title: string;
	asc?: boolean;
	sortHandler?: (asc: boolean) => void;
	notSortable?: boolean;
};

export function Sorter({ title, asc, sortHandler, notSortable }: Readonly<PropType>) {
	const clickHandler = useCallback(() => {
		sortHandler(!(asc ?? false));
	}, [sortHandler]);

	return (
		<div className={containerClass}>
			<button className={containerClass} disabled={notSortable} onClick={() => clickHandler?.()}>
				{title}
				{!notSortable ? (
					<div className={clsx(sorterClass)}>
						<ChevronUp
							className={clsx(asc === true ? 'opacity-100' : 'opacity-50')}
							width={12}
							height={12}
						/>
						<ChevronDown
							className={clsx(asc === false ? 'opacity-100' : 'opacity-50')}
							width={12}
							height={12}
						/>
					</div>
				) : null}
			</button>
		</div>
	);
}
