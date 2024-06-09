export type EditData = {
	id: number;
	percentage: number;
	start_date: Date;
	end_date?: Date;
	inclusive: boolean;
};

export type SearchDataType = {
	general: { value: string; valid: boolean };
	status: { value: boolean; valid: boolean };
};

export type FormDataType = {
	percentage: { value: number; valid: boolean };
	start_date: { value: Date; valid: boolean };
	end_date: { value: Date; valid: boolean };
	inclusive: { value: boolean; valid: boolean };
};
