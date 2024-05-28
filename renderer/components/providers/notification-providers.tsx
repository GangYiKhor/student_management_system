import { randomUUID } from 'crypto';
import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { GeneralNotification } from '../../utils/types/notification-type';

const Notification = createContext<{
	notifications: GeneralNotification[];
	setNotification: (value: SetNotification) => void;
}>({ notifications: [], setNotification: undefined });

export type SetNotification = {
	title?: string;
	message?: string;
	source?: string;
	type?: 'INFO' | 'WARN' | 'ERROR';
	remove?: string;
};

function reducer(state: GeneralNotification[], action?: SetNotification) {
	if (!action) {
		return state;
	}

	if (action.remove) {
		return [...state.filter(value => value.id !== action.remove)];
	}

	const newNotification: GeneralNotification = {
		id: randomUUID(),
		title: action.title ?? 'Unknown Error!',
		message: action.message ?? 'Unknown Error!',
		occurredAt: new Date(),
		source: action.source ?? '',
		type: action.type ?? 'ERROR',
	};

	return [...state, newNotification];
}

type PropType = {
	children: React.ReactNode;
};

export function NotificationProvider({ children }: Readonly<PropType>) {
	const [notifications, setNotification] = useReducer<
		React.Reducer<GeneralNotification[], SetNotification>
	>(reducer, []);
	const notificationProviderValue = useMemo(
		() => ({
			notifications,
			setNotification,
		}),
		[notifications, setNotification],
	);

	return (
		<Notification.Provider value={notificationProviderValue}>{children}</Notification.Provider>
	);
}

export function useNotificationContext() {
	return useContext(Notification);
}
