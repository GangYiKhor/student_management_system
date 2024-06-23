import clsx from 'clsx';

type PropType = {
	addOnClass?: string;
};

export default function ThinSeparator({ addOnClass }: Readonly<PropType>) {
	return (
		<hr
			className={clsx(
				'h-0.5',
				'my-1',
				'bg-gray-200',
				'dark:bg-gray-500',
				'border-none',
				'rounded-2xl',
				addOnClass,
			)}
		/>
	);
}
