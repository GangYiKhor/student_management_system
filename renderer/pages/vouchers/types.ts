export type EditData = {
	id: string;
	student_id?: number;
	discount?: number;
	is_percentage?: boolean;
	start_date?: Date;
	expired_at?: Date;
	used?: boolean;
};

export type SearchDataType = {
	general: { value: string; valid: boolean };
	student_search_id: { value: number; valid: boolean };
	status: { value: boolean; valid: boolean };
};

export type FormDataType = {
	id: { value: string; valid: boolean };
	student_id: { value: number; valid: boolean };
	discount: { value: number; valid: boolean };
	is_percentage: { value: boolean; valid: boolean };
	start_date: { value: Date; valid: boolean };
	expired_at: { value: Date; valid: boolean };
	used: { value: boolean; valid: boolean };
	duration: { value: string; valid: boolean };
};
