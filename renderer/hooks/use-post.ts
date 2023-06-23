import axios from "axios";

export function usePost(url: string, body?: object): any {
	return async () => {
		const { data } = await axios.post(url, { body });
		return data;
	};
}
