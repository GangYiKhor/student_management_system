import { useCallback, useEffect } from 'react';
import { useNotificationContext } from './providers/notification-providers';
import { AlertTriangle, Ban, Info } from 'lucide-react';
import clsx from 'clsx';

const errorColor = clsx('bg-red-200', 'dark:bg-red-900');
const warnColor = clsx('bg-orange-200', 'dark:bg-yellow-800');
const infoColor = clsx('bg-blue-200', 'dark:bg-gray-600');

const containerClass = clsx(
	'absolute',
	'bottom-0',
	'right-0',
	'max-w-[40%]',
	'max-h-screen',
	'overflow-x-hidden',
	'overflow-y-auto',
	'mr-5',
	'mb-5',
);

const notificationClass = clsx('rounded-lg', 'flex', 'items-center', 'mt-5');

export function CustomNotification() {
	const { notifications, setNotification } = useNotificationContext();

	const closeHandler = useCallback((id: string) => {
		setNotification({ remove: id });
	}, []);

	useEffect(() => {
		notifications.forEach(value => {
			setTimeout(
				() => {
					closeHandler(value.id);
				},
				value.type === 'INFO' ? 2500 : 20000,
			);
		});
	}, [notifications]);

	const notificationBackgroundColor = useCallback((type: 'ERROR' | 'WARN' | 'INFO') => {
		switch (type) {
			case 'ERROR':
				return errorColor;

			case 'WARN':
				return warnColor;

			case 'INFO':
				return infoColor;
		}
	}, []);

	const notificationIcon = useCallback((type: 'ERROR' | 'WARN' | 'INFO') => {
		switch (type) {
			case 'ERROR':
				return <Ban height={35} width={35} color="#ff2929" />;

			case 'INFO':
				return <Info height={35} width={35} color="#0088c2" />;

			case 'WARN':
				return <AlertTriangle height={35} width={35} color="#ffa200" />;
		}
	}, []);

	return (
		<div className={containerClass}>
			{notifications
				? notifications.map(value => {
						return (
							<div
								key={value.id}
								className={clsx(
									notificationBackgroundColor(value.type),
									notificationClass,
									value.type === 'ERROR' ? 'shake' : '',
								)}
							>
								<div className={clsx('pl-4')}>{notificationIcon(value.type)}</div>
								<div>
									<p className={clsx('px-5', 'pt-2', 'font-bold')}>{value.title}</p>
									<p className={clsx('px-5')}>{value.message}</p>
									<p className={clsx('px-5', 'py-2', 'font-mono', 'text-xs', 'text-right')}>
										{`${value.source} [${value.occurredAt.toLocaleDateString(
											'en-GB',
										)} ${value.occurredAt.toLocaleTimeString('en-GB')}]`}
									</p>
								</div>
								<div className={clsx('pr-3', 'self-start')}>
									<button onClick={() => closeHandler(value.id)}>x</button>
								</div>
							</div>
						);
				  })
				: null}
		</div>
	);
}
