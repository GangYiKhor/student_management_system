import clsx from 'clsx';

const userClass = clsx('text-3xl', 'font-medium', 'text-center', 'pt-6', 'pb-5', 'select-none');

export function User({ user }) {
	return (
		<div>
			<p className={userClass}>{user}</p>
		</div>
	);
}
