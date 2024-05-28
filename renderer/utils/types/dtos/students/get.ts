export type StudentsGetDto = {
	search_text?: string;
	form_id?: number;
	reg_date?: Date | { gte?: Date; lte?: Date };
	reg_date_start?: Date;
	reg_date_end?: Date;
	reg_year?: number;
	is_active?: boolean;
	orderBy?: string;
};

export type StudentsGetQueryDto = {
	search_text?: string;
	form_id?: string;
	reg_date_start?: string;
	reg_date_end?: string;
	reg_year?: string;
	is_active?: string;
	orderBy?: string;
};
