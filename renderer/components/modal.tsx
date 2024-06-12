import clsx from 'clsx';
import { ReactNode, useCallback, useEffect } from 'react';
import { WhiteBlackButtonClass } from '../utils/tailwindClass/button';
import { CloseButtonIcon } from './close-button-icon';
import { ThemeToggle } from './theme-toggle';

const backgroundClass = clsx(
	'flex',
	'justify-center',
	'items-center',
	'overflow-x-hidden',
	'overflow-y-auto',
	'fixed',
	'inset-0',
	'z-10',
	'p-5',
	'bg-[rgba(0,0,0,0.3)]',
);

const blurCloseButton = clsx('w-full', 'h-full', 'fixed', '-z-10');

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

const contentClass = clsx('px-6', 'py-2', 'overflow-y-auto', 'max-h-[80vh]', 'min-w-[50vw]');

const footerContainerClass = clsx(
	'flex',
	'justify-end',
	'items-center',
	'gap-4',
	'p-5',
	'border-t',
	'border-slate-300',
);

export type ModalButtons = {
	text: string;
	class: string;
	action: CallableFunction;
	disabled?: boolean;
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

export default function Modal({
	title,
	closeModal,
	closeOnBlur,
	buttons,
	children,
}: Readonly<PropType>) {
	if (!buttons?.length) {
		buttons = [
			{
				...CloseButton,
				action: () => closeModal(),
			},
		];
	}

	const escHandler = useCallback(
		(e: KeyboardEvent) => (e.key === 'Escape' ? closeModal() : null),
		[closeModal],
	);

	useEffect(() => {
		window.addEventListener('keydown', escHandler);
		return () => window.removeEventListener('keydown', escHandler);
	}, [escHandler]);

	return (
		<div className={backgroundClass}>
			<button
				className={blurCloseButton}
				disabled={!closeOnBlur}
				onClick={() => closeModal()}
			></button>
			<div className={containerClass}>
				<div className={headerContainerClass}>
					<h3 className={headerClass}>{title}</h3>
					<div className={headerButtonClass}>
						<ThemeToggle />
						<button onClick={() => closeModal()}>
							<CloseButtonIcon />
						</button>
					</div>
				</div>

				<div className={contentClass}>{children}</div>

				<div className={footerContainerClass}>
					{buttons?.map(value => (
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
					)) ?? null}
				</div>
			</div>
		</div>
	);
}
