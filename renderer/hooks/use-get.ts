import axios, { AxiosResponse } from 'axios';
import { SelectOptions } from '../utils/types/select-options';

export function useGet<T = any, Res = any>(url: string, parseFunc?: (value: Res) => Res) {
	return async (params?: T, path?: string | number): Promise<Res> => {
		let curUrl = url;

		if (path) {
			if (curUrl.endsWith('/')) {
				curUrl += path;
			} else {
				curUrl += '/' + path;
			}
		}

		const { data } = await axios.get<T, AxiosResponse<Res>>(curUrl, { params });
		return parseFunc?.(data) ?? data;
	};
}

export function useGetOptions<T = any, Res = any>(
	url: string,
	label: (value: Res) => string,
	valueMap?: (value: Res) => any,
	parseFunc?: (value: Res[]) => Res[],
) {
	return async (params?: T, path?: string | number): Promise<SelectOptions<Res>> => {
		let curUrl = url;

		if (path) {
			if (curUrl.endsWith('/')) {
				curUrl += path;
			} else {
				curUrl += '/' + path;
			}
		}

		let { data } = await axios.get<T, AxiosResponse<Res[]>>(curUrl, { params });
		if (parseFunc) {
			data = parseFunc(data);
		}

		return data.map(value => ({ value: valueMap?.(value) ?? value, label: label(value) }));
	};
}
