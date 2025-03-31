import clsx from 'clsx';
import Image from 'next/image';
import { useEffect } from 'react';

type PropType = {
	isLoading?: boolean;
	hideText?: boolean;
	maxWait?: number;
	children?: React.ReactNode;
};

export function Loader({
	isLoading,
	hideText,
	maxWait = null,
	children = null,
}: Readonly<PropType>) {
	useEffect(() => {
		if (maxWait > 0) {
			setTimeout(() => (isLoading = false), maxWait);
		}
	}, []);

	if (isLoading) {
		return (
			<div className={clsx('w-full', 'text-center')}>
				<div className={clsx('flex', 'flex-col')}>
					<Image
						src={'/images/loader.svg'}
						height={100}
						width={100}
						alt="Loading"
						className={clsx('w-[100px]', 'h-[100px]', 'invert', 'dark:invert-0')}
					/>
					{hideText || <p>Loading...</p>}
				</div>
			</div>
		);
	} else {
		return children;
	}
}
