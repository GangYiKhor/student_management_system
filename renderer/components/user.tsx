import clsx from 'clsx';

const userClass = clsx('text-3xl', 'font-medium', 'text-center', 'pt-6', 'pb-5', 'select-none');

type PropType = {
	user: string;
};

export function User({ user }: Readonly<PropType>) {
	return (
		<div>
			<p className={userClass}>{user}</p>
		</div>
	);
}
