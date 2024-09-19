import clsx from 'clsx';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { Header } from '../components/header';
import { NavigationBar } from '../components/navigation-bar';

const layoutClass = clsx('flex', 'bg-[rgb(250,250,250)] dark:bg-[rgb(42,46,50)]');
const mainClass = clsx('flex-1', 'w-full h-screen', 'overflow-auto');
const contentClass = clsx('p-5');
const backButtonClass = clsx(
	'flex items-center gap-0.5',
	'text-gray-600 dark:text-gray-400',
	'hover:underline',
	'active:opacity-80',
	'pl-5 pt-3',
);

type PropType = {
	children: ReactNode;
	headerTitle: string;
	navigateBack?: boolean;
};

export function Layout({ children, headerTitle, navigateBack }: Readonly<PropType>) {
	const router = useRouter();

	return (
		<div className={layoutClass}>
			<NavigationBar />
			<main className={mainClass}>
				<Header title={headerTitle} />
				{navigateBack ? (
					<button className={backButtonClass} onClick={() => router.back()}>
						{'< Back'}
					</button>
				) : null}
				<section className={contentClass}>{children}</section>
			</main>
		</div>
	);
}
