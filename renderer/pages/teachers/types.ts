import { TeachersGetResponse } from '../../utils/types/responses/teachers/get';

export type EditData = TeachersGetResponse;

export type SearchDataType = {
	general: { value: string; valid: boolean };
	status: { value: boolean; valid: boolean };
};

export type FormDataType = {
	teacher_name: { value: string; valid: boolean };
	phone_number: { value: string; valid: boolean };
	ic: { value: string; valid: boolean };
	email: { value: string; valid: boolean };
	address: { value: string; valid: boolean };
};
