import clsx from 'clsx';
import Image from 'next/image';

type PropType = {
	hideText?: boolean;
};

export function Loader({ hideText }: PropType) {
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
}
