export type EditData = {
	id: number;
	start_date?: Date;
	end_date?: Date;
	form_id?: number;
	subject_count_from?: number;
	subject_count_to?: number;
	discount_per_subject?: number;
};

export type SearchDataType = {
	general: { value: string; valid: boolean };
	form_id: { value: number; valid: boolean };
	subject_count: { value: number; valid: boolean };
	status: { value: boolean; valid: boolean };
};

export type FormDataType = {
	form_id: { value: number; valid: boolean };
	start_date: { value: Date; valid: boolean };
	end_date: { value: Date; valid: boolean };
	subject_count_from: { value: number; valid: boolean };
	subject_count_to: { value: number; valid: boolean };
	discount_per_subject: { value: number; valid: boolean };
};
