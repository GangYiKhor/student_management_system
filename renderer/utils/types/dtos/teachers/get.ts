export type TeachersGetDto = {
	id?: number;
	teacher_name?: string;
	ic?: string;
	phone_number?: string;
	email?: string;
	address?: string;
	start_date?: Date;
	end_date?: Date;
	is_active?: boolean;
	orderBy?: string;
};

export type TeachersGetQueryDto = {
	id?: string;
	teacher_name?: string;
	ic?: string;
	phone_number?: string;
	email?: string;
	address?: string;
	start_date?: string;
	end_date?: string;
	is_active?: string;
	orderBy?: string;
};
