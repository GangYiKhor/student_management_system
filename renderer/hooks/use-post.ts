import axios, { AxiosError, AxiosResponse } from 'axios';
import { useNotificationContext } from '../components/providers/notification-providers';
import { SERVER_CONNECTION_ERROR } from '../utils/constants/ErrorResponses';

export function usePost<T = any, Res = any>(url: string, parseFunc?: (value: Res) => Res) {
	const { setNotification } = useNotificationContext();

	return async (body: T, path?: string | number): Promise<Res> => {
		try {
			let curUrl = url;

			if (path) {
				if (curUrl.endsWith('/')) {
					curUrl += path;
				} else {
					curUrl += '/' + path;
				}
			}

			const { data } = await axios.post<void, AxiosResponse<Res>, T>(curUrl, body);
			return parseFunc?.(data) ?? data;
		} catch (error: any) {
			if (error instanceof AxiosError) {
				setNotification({ ...error?.response?.data?.error });
			} else {
				setNotification(SERVER_CONNECTION_ERROR);
			}
			throw error;
		}
	};
}
