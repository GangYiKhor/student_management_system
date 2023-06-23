import axios from "axios";

export function useGet(url: string, params?: object): any {
	return async () => {
		const { data } = await axios.get(url, { params });
		return data;
	};
}
