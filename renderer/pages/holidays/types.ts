export type EditData = {
	id: number;
	date: Date;
	description: string;
};

export type SearchDataType = {
	general: { value: string; valid: boolean };
	start_date: { value: Date; valid: boolean };
	end_date: { value: Date; valid: boolean };
	period: { value: string; valid: boolean };
};

export type FormDataType = {
	date: { value: Date; valid: boolean };
	description: { value: string; valid: boolean };
};
