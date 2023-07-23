import axios, { AxiosResponse } from 'axios';

export function useGet<T = any, Res = any>(url: string, parseFunc?: (value: Res) => Res) {
	return async (params?: T) => {
		let { data } = await axios.get<T, AxiosResponse<Res>>(url, { params });
		if (parseFunc) {
			data = parseFunc(data);
		}
		return data;
	};
}
