import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useCallback } from 'react';

const containerClass = clsx('flex', 'justify-center');
const sorterClass = clsx('flex', 'flex-col', 'ml-2');

type PropType = {
	title: string;
	asc?: boolean;
	sortHandler?: CallableFunction;
};

export function Sorter({ title, asc, sortHandler }: PropType) {
	const clickHandler = useCallback(() => {
		const result = asc !== undefined ? !asc : true;
		sortHandler(result);
	}, [sortHandler]);

	return (
		<div className={containerClass}>
			{title}
			<div className={clsx(sorterClass, sortHandler && 'cursor-pointer')} onClick={clickHandler}>
				<ChevronUp
					className={clsx(asc === true ? 'opacity-100' : 'opacity-25')}
					width={12}
					height={12}
				/>
				<ChevronDown
					className={clsx(asc === false ? 'opacity-100' : 'opacity-25')}
					width={12}
					height={12}
				/>
			</div>
		</div>
	);
}
