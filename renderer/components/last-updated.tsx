import clsx from 'clsx';
import { RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ButtonRoundClass, EmptyLightButtonClass } from '../utils/class/button';

const layoutClass = clsx('flex', 'justify-end', 'items-center', 'gap-2');
const textClass = clsx('font-mono', 'text-right', 'block');

type PropType = {
	lastUpdatedAt: number | Date;
	refetch?: CallableFunction;
};

export function LastUpdatedAt({ lastUpdatedAt, refetch }: Readonly<PropType>) {
	const [date, setDate] = useState<string>();
	const [time, setTime] = useState<string>();
	useEffect(() => {
		if (lastUpdatedAt) {
			if (typeof lastUpdatedAt === 'number') {
				lastUpdatedAt = new Date(lastUpdatedAt);
			}
			setDate(lastUpdatedAt.toLocaleDateString('en-GB'));
			setTime(lastUpdatedAt.toLocaleTimeString('en-GB'));
		}
	});

	return (
		<div className={layoutClass}>
			<p className={textClass}>
				Last Updated At:
				{' ' + (date ? `${date} [${time}]` : 'Not Updated')}
			</p>
			{refetch ? (
				<button className={clsx(EmptyLightButtonClass, ButtonRoundClass)} onClick={() => refetch()}>
					<RefreshCcw height={15} width={15} />
				</button>
			) : null}
		</div>
	);
}
