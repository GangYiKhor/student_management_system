export type EditData = {
	id: number;
	teacher_id?: number;
	start_date?: Date;
	end_date?: Date;
	class_year?: number;
	form_id?: number;
	day?: number;
	start_time?: Date;
	end_time?: Date;
	fees?: number;
	is_package?: boolean;
	class_name?: string;
};

export type SearchDataType = {
	general: { value: string; valid: boolean };
	form_id: { value: number; valid: boolean };
	teacher_id: { value: number; valid: boolean };
	class_year: { value: number; valid: boolean };
	day: { value: number; valid: boolean };
	status: { value: boolean; valid: boolean };
};

export type FormDataType = {
	teacher_id: { value: number; valid: boolean };
	start_date: { value: Date; valid: boolean };
	end_date: { value: Date; valid: boolean };
	class_year: { value: number; valid: boolean };
	form_id: { value: number; valid: boolean };
	day: { value: number; valid: boolean };
	start_time: { value: Date; valid: boolean };
	end_time: { value: Date; valid: boolean };
	fees: { value: number; valid: boolean };
	is_package: { value: boolean; valid: boolean };
	class_name: { value: string; valid: boolean };
};
