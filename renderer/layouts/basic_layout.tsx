import clsx from 'clsx';
import { ReactNode } from 'react';
import { Header } from '../components/header';
import { NavigateBack } from '../components/navigate-back';
import { NavigationBar } from '../components/navigation-bar';

const layoutClass = clsx('flex', 'bg-bglight dark:bg-bgdark');
const mainClass = clsx('flex-1', 'w-full h-screen', 'overflow-auto');
const contentClass = clsx('p-5');

type PropType = {
	children: ReactNode;
	headerTitle: string;
	navigateBack?: boolean;
};

export function Layout({ children, headerTitle, navigateBack }: Readonly<PropType>) {
	return (
		<div className={layoutClass}>
			<NavigationBar />
			<main className={mainClass}>
				<Header title={headerTitle} />
				<section className={contentClass}>
					{navigateBack ? <NavigateBack /> : null}
					{children}
				</section>
			</main>
		</div>
	);
}
