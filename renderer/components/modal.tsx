import clsx from 'clsx';
import React, { ReactNode } from 'react';
import { ThemeToggle } from './theme-toggle';
import { WhiteBlackButtonClass } from '../utils/class/button';

const backgroundClass = clsx(
	'flex',
	'justify-center',
	'items-center',
	'overflow-x-hidden',
	'overflow-y-auto',
	'fixed',
	'inset-0',
	'z-50',
	'p-5',
);

const containerClass = clsx(
	'w-auto',
	'sm:max-w-[90%]',
	'md:max-w-[80%]',
	'lg:max-w-[75%]',
	'rounded-lg',
	'shadow-lg',
	'flex-col',
	'mx-auto',
	'my-auto',
	'bg-bglight',
	'dark:bg-bgdark',
);

const headerContainerClass = clsx(
	'flex',
	'justify-between',
	'gap-5',
	'items-center',
	'p-5',
	'border-b',
	'border-slate-300',
);
const headerClass = clsx('text-3xl', 'font-bold');

const headerButtonClass = clsx('flex', 'justify-end', 'items-center', 'gap-4');
const closeButtonClass = clsx(
	'text-4xl',
	'w-[36px]',
	'pb-2',
	'text-gray-500',
	'hover:text-gray-700',
	'active:text-gray-900',
	'dark:text-gray-200',
	'dark:hover:text-gray-400',
	'dark:active:text-gray-600',
	'transition-colors',
);

const contentClass = clsx('p-6');

const footerContainerClass = clsx(
	'flex',
	'justify-end',
	'items-center',
	'gap-4',
	'p-5',
	'border-t',
	'border-slate-300',
);

const clickShieldClass = clsx('opacity-25', 'fixed', 'inset-0', 'z-40', 'bg-black');

export type ModalButtons = {
	text: string;
	class: string;
	action: CallableFunction;
}[];

const CloseButton = {
	text: 'Close',
	class: WhiteBlackButtonClass,
};

type PropType = {
	title: string;
	closeModal: CallableFunction;
	closeOnBlur?: boolean;
	buttons?: ModalButtons;
	children: ReactNode;
};

export default function Modal({ title, closeModal, closeOnBlur, buttons, children }: PropType) {
	if (!buttons?.length) {
		buttons = [
			{
				...CloseButton,
				action: () => closeModal(),
			},
		];
	}

	return (
		<React.Fragment>
			<div
				className={backgroundClass}
				onClick={e => closeOnBlur && e.target === e.currentTarget && closeModal()}
			>
				<div className={containerClass}>
					<div className={headerContainerClass}>
						<h3 className={headerClass}>{title}</h3>
						<div className={headerButtonClass}>
							<ThemeToggle />
							<button className={closeButtonClass} onClick={() => closeModal()}>
								×
							</button>
						</div>
					</div>
					<div className={contentClass}>{children}</div>
					<div className={footerContainerClass}>
						{buttons
							? buttons.map(value => (
									<button
										key={value.text}
										className={value.class}
										onClick={async () =>
											value.action.constructor.name === 'AsyncFunction'
												? await value.action()
												: value.action()
										}
									>
										{value.text}
									</button>
							  ))
							: null}
					</div>
				</div>
			</div>
			<div className={clickShieldClass}></div>
		</React.Fragment>
	);
}
