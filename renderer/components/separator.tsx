import clsx from 'clsx';

type PropType = {
	addOnClass?: string;
};

export default function Separator({ addOnClass }: Readonly<PropType>) {
	return (
		<hr
			className={clsx(
				'h-1',
				'my-2',
				'bg-gray-200',
				'dark:bg-gray-500',
				'border-none',
				'rounded-2xl',
				addOnClass,
			)}
		/>
	);
}
