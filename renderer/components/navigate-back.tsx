import clsx from 'clsx';
import { useRouter } from 'next/router';

const backButtonClass = clsx(
	'text-gray-600 dark:text-gray-400',
	'hover:underline',
	'active:opacity-80',
);

export function NavigateBack() {
	const router = useRouter();

	return (
		<button className={backButtonClass} onClick={() => router.back()}>
			{'< Back'}
		</button>
	);
}
