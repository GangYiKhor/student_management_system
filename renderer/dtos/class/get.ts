export type ClassGetDto = {
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
	orderBy?: string;
};

export type ClassGetQueryDto = {
	teacher_id?: string;
	start_date?: string;
	end_date?: string;
	class_year?: string;
	form_id?: string;
	day?: string;
	start_time?: string;
	end_time?: string;
	fees?: string;
	is_package?: string;
	class_name?: string;
	orderBy?: string;
};
