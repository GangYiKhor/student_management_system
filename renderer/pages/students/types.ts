import { ClassesGetResponse } from '../../utils/types/responses/classes/get';

export type EditData = {
	id: number;
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

export type SearchDataType = {
	text: { value: string; valid: boolean };
	form_id: { value: number; valid: boolean };
	reg_date_start: { value: Date; valid: boolean };
	reg_date_end: { value: Date; valid: boolean };
	reg_year: { value: number; valid: boolean };
	status: { value: boolean; valid: boolean };
};

export type FormDataType = {
	student_name: { value: string; valid: boolean };
	form_id: { value: number; valid: boolean };
	reg_date: { value: Date; valid: boolean };
	reg_year: { value: number; valid: boolean };
	gender: { value: string; valid: boolean };
	ic: { value: string; valid: boolean };
	school: { value: string; valid: boolean };
	phone_number: { value: string; valid: boolean };
	parent_phone_number: { value: string; valid: boolean };
	email: { value: string; valid: boolean };
	address: { value: string; valid: boolean };
	[key: string]: { value: ClassesGetResponse | string | number | Date; valid: boolean };
};
