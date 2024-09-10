import { STUDENT_FORM_API_PATH } from '../utils/constants/constants';
import { StudentFormsGetDto } from '../utils/types/dtos/student-forms/get';
import { StudentFormsGetResponse } from '../utils/types/responses/student-forms/get';
import { useGetOptions } from './use-get';

export function useGetFormOptionsIdOnly() {
	return useGetOptions<StudentFormsGetDto, StudentFormsGetResponse>(
		STUDENT_FORM_API_PATH,
		value => value.form_name,
		value => value.id,
	);
}

export function useGetFormOptions() {
	return useGetOptions<StudentFormsGetDto, StudentFormsGetResponse>(
		STUDENT_FORM_API_PATH,
		value => value.form_name,
		value => ({ id: value.id, form_name: value.form_name }),
	);
}
