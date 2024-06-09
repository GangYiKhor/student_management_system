export type StudentCreateDto = {
	student_name: string;
	form_id: number;
	reg_date: Date;
	reg_year: number;
	gender?: string;
	ic?: string;
	school?: string;
	phone_number?: string;
	parent_phone_number?: string;
	email?: string;
	address?: string;
	is_active?: boolean;
};
