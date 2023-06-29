import React from 'react';
import { NavigationBar } from '../components/navigation-bar';
import clsx from 'clsx';
import { Header } from '../components/header';

const layoutClass = clsx('flex', 'bg-[rgb(250,250,250)]', 'dark:bg-[rgb(42,46,50)]');

const mainClass = clsx('flex-1', 'w-full', 'h-screen', 'overflow-auto');

const contentClass = clsx('pl-5', 'pr-5', 'pt-5', 'pb-5');

type PropType = {
	children: any;
	headerTitle: string;
	headerButtons?: [
		{
			action: CallableFunction;
			text: string;
			buttonDesignClass: string;
		},
	];
};

export function Layout({ children, headerTitle, headerButtons }: PropType) {
	return (
		<div className={layoutClass}>
			<NavigationBar />
			<main className={mainClass}>
				<Header buttons={headerButtons} title={headerTitle} />
				<section className={contentClass}>{children}</section>
			</main>
		</div>
	);
}
