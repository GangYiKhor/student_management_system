export type ClassesGetDto = {
	teacher_id?: number;
	start_date?: Date | { lte?: Date; gte?: Date };
	end_date?: Date | { lte?: Date; gte?: Date };
	class_year?: number;
	form_id?: number;
	day?: number;
	start_time?: Date;
	end_time?: Date;
	fees?: number;
	is_package?: boolean;
	class_name?: string;
	is_active?: boolean;
	orderBy?: string;
};

export type ClassesGetQueryDto = {
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
	is_active?: string;
	orderBy?: string;
};
