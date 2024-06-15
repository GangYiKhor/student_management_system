import { CLASS_API_PATH } from '../utils/constants/constants';
import { ClassesGetDto } from '../utils/types/dtos/classes/get';
import { ClassesGetResponse } from '../utils/types/responses/classes/get';
import { useGetOptions } from './use-get';

export function useGetClassOptions(onlyId = false) {
	return useGetOptions<ClassesGetDto, ClassesGetResponse>(
		CLASS_API_PATH,
		value => `${value.class_name} (${value.teacher.teacher_name}) [${value.form.form_name}]`,
		onlyId ? value => value.id : undefined,
	);
}
