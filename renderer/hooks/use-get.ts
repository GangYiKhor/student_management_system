import axios, { AxiosResponse } from 'axios';

export function useGet<T = any, Res = any>(url: string) {
	return async (params?: T) => {
		const { data } = await axios.get<T, AxiosResponse<Res>>(url, { params });
		return data;
	};
}
