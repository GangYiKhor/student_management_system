export type StudentsGetResponse = {
	id: number;
	student_name: string;
	form: {
		id: number;
		form_name: string;
	};
	reg_date: Date;
	reg_year: number;
	gender?: string;
	ic?: string;
	school?: string;
	phone_number?: string;
	parent_phone_number?: string;
	email?: string;
	address?: string;
	is_active: boolean;
};

export type StudentsGetResponses = StudentsGetResponse[];
