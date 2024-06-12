import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useNotificationContext } from '../components/providers/notification-providers';
import { SERVER_CONNECTION_ERROR } from '../utils/constants/ErrorResponses';
import { ErrorResponse } from '../utils/types/responses/error';

type PropType<Res = any> = {
	queryKey: string[];
	queryFn: () => Promise<Res>;
	disabled?: boolean;
	errorHandler?: (error: any) => any;
	fetchOnVariable?: any[];
};

export function useCustomQuery<Res = any>({
	queryKey,
	queryFn,
	disabled,
	errorHandler,
	fetchOnVariable = [],
}: Readonly<PropType<Res>>) {
	const { setNotification } = useNotificationContext();

	const { data, isLoading, error, isError, dataUpdatedAt, refetch } = useQuery<
		Res,
		AxiosError<ErrorResponse>
	>({
		queryKey,
		queryFn,
		enabled: !disabled,
	});

	useEffect(() => {
		if (isError) {
			if (errorHandler) {
				errorHandler(error);
			} else if (error) {
				setNotification({ ...error?.response?.data?.error });
			} else {
				setNotification(SERVER_CONNECTION_ERROR);
			}
		}
	}, [isError]);

	useEffect(() => {
		if (fetchOnVariable.length) {
			refetch();
		}
	}, [...fetchOnVariable]);

	return { data, isLoading, error, isError, dataUpdatedAt, refetch };
}
