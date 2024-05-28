export type ValidType = { value: boolean; set: (value: boolean) => void };
export type ValidTypes = {
	value: boolean[];
	set: React.Dispatch<{
		index: number;
		newStatus: boolean;
	}>;
};
