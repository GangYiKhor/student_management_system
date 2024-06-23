import { CLASS_API_PATH } from '../utils/constants/constants';
import { parseDateTime } from '../utils/dateOperations';
import { ClassesGetDto } from '../utils/types/dtos/classes/get';
import { ClassesGetResponse, ClassesGetResponses } from '../utils/types/responses/classes/get';
import { useGet, useGetOptions } from './use-get';

export function useGetClassOptions(onlyId = false) {
	return useGetOptions<ClassesGetDto, ClassesGetResponse>(
		CLASS_API_PATH,
		value => `${value.class_name} (${value.teacher.teacher_name}) [${value.form.form_name}]`,
		onlyId ? value => value.id : undefined,
	);
}

const parseGetData = (data: ClassesGetResponses) =>
	data.map(value => {
		value.start_date = parseDateTime(value.start_date);
		value.end_date = parseDateTime(value.end_date);
		value.start_time = parseDateTime(value.start_time);
		value.end_time = parseDateTime(value.end_time);
		return value;
	});

export function useGetClassComboBoxOptions() {
	return useGet<ClassesGetDto, ClassesGetResponses>(CLASS_API_PATH, parseGetData);
}
