import React from 'react';
import { NavigationBar } from '../components/navigation';
import clsx from 'clsx';
import { User } from '../components/user';
import { Header } from '../components/header';

const layoutClass = clsx('flex', 'bg-[rgb(250,250,250)]', 'dark:bg-[rgb(42,46,50)]');
const navigationClass = clsx(
	'bg-[rgb(203,227,245)]',
	'dark:bg-[rgb(33,37,41)]',
	'min-h-screen',
	'max-h-screen',
	'overflow-y-auto',
);
const separatorClass = clsx(
	'border-0',
	'h-1',
	'bg-[rgba(255,255,255,0.7)]',
	'ml-6',
	'mr-6',
	'mb-4',
	'rounded-full',
);
const mainClass = clsx('flex-1', 'w-full', 'h-screen', 'overflow-auto');

const contentClass = clsx('pl-5', 'pr-5', 'pt-5', 'pb-5');

type PropType = {
	children: any;
	headerTitle: string;
	headerButtons?: {
		action: CallableFunction;
		text: string;
	};
};

export function Layout({ children, headerTitle, headerButtons }: PropType) {
	return (
		<div className={layoutClass}>
			<nav className={navigationClass}>
				<User user={'TEST'} />
				<hr className={separatorClass} />
				<NavigationBar />
			</nav>
			<main className={mainClass}>
				<Header buttons={headerButtons} title={headerTitle} />
				<section className={contentClass}>{children}</section>
			</main>
		</div>
	);
}
