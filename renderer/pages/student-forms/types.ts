import { StudentFormsGetResponse } from '../../utils/types/responses/student-forms/get';

export type EditData = StudentFormsGetResponse;

export type SearchDataType = {
	general: { value: string; valid: boolean };
	status: { value: boolean; valid: boolean };
};

export type FormDataType = {
	form_name: { value: string; valid: boolean };
};
