import clsx from 'clsx';
import { AlertTriangle, Ban, Info } from 'lucide-react';
import { useEffect } from 'react';
import { dateFormatter } from '../utils/dateOperations';
import { CloseButtonIcon } from './close-button-icon';
import { useNotificationContext } from './providers/notification-providers';

const errorColor = clsx('bg-red-200', 'dark:bg-red-900');
const warnColor = clsx('bg-orange-200', 'dark:bg-yellow-800');
const infoColor = clsx('bg-blue-200', 'dark:bg-gray-600');
const notificationClass = clsx('flex', 'justify-between', 'rounded-lg', 'mt-5');

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

const getNotificationIcon = (type: 'ERROR' | 'WARN' | 'INFO') => {
	switch (type) {
		case 'ERROR':
			return <Ban height={35} width={35} color="#ff2929" />;

		case 'INFO':
			return <Info height={35} width={35} color="#0088c2" />;

		case 'WARN':
			return <AlertTriangle height={35} width={35} color="#ffa200" />;
	}
};

const getNotificationContainerClass = (type: 'ERROR' | 'WARN' | 'INFO') => {
	let classString = '';
	switch (type) {
		case 'ERROR':
			classString = clsx(errorColor, 'shake');
			break;

		case 'WARN':
			classString = warnColor;
			break;

		case 'INFO':
			classString = infoColor;
	}

	return clsx(classString, notificationClass);
};

export function CustomNotification() {
	const { notifications, setNotification } = useNotificationContext();

	const closeHandler = (id: string) => {
		setNotification({ remove: id });
	};

	useEffect(() => {
		notifications.forEach(value => {
			setTimeout(() => closeHandler(value.id), value.type === 'INFO' ? 2500 : 10000);
		});
	}, [notifications]);

	return (
		<div className={containerClass}>
			{notifications?.map(value => (
				<div key={value.id} className={getNotificationContainerClass(value.type)}>
					<div className={clsx('flex', 'items-center')}>
						<div className={clsx('pl-4')}>{getNotificationIcon(value.type)}</div>

						<div>
							<p className={clsx('px-5', 'pt-2', 'font-bold')}>{value.title}</p>
							<p className={clsx('px-5')}>{value.message}</p>
							<p className={clsx('px-5', 'py-2', 'font-mono', 'text-xs', 'text-right')}>
								{`${value.source} [${dateFormatter(value.occurredAt, { format: 'yyyy-MM-dd hh:mm:ss a' })}]`}
							</p>
						</div>
					</div>

					<button
						className={clsx('pt-2', 'pr-3', 'self-start')}
						onClick={() => closeHandler(value.id)}
					>
						<CloseButtonIcon />
					</button>
				</div>
			)) ?? null}
		</div>
	);
}
