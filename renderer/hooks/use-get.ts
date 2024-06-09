import axios, { AxiosResponse } from 'axios';
import { SelectOptions } from '../utils/types/select-options';

export function useGet<T = any, Res = any>(url: string, parseFunc?: (value: Res) => Res) {
	return async (params?: T): Promise<Res> => {
		const { data } = await axios.get<T, AxiosResponse<Res>>(url, { params });
		return parseFunc?.(data) ?? data;
	};
}

export function useGetOptions<T = any, Res = any>(
	url: string,
	label: (value: Res) => string,
	valueMap?: (value: Res) => any,
	parseFunc?: (value: Res[]) => Res[],
) {
	return async (params?: T): Promise<SelectOptions<Res>> => {
		let { data } = await axios.get<T, AxiosResponse<Res[]>>(url, { params });
		if (parseFunc) {
			data = parseFunc(data);
		}

		return data.map(value => ({ value: valueMap?.(value) ?? value, label: label(value) }));
	};
}
