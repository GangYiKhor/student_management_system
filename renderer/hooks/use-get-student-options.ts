import { CLASS_API_PATH, STUDENT_API_PATH } from '../utils/constants/constants';
import { parseDateTime } from '../utils/dateOperations';
import { StudentsGetDto } from '../utils/types/dtos/students/get';
import { StudentsGetResponse, StudentsGetResponses } from '../utils/types/responses/students/get';
import { useGet, useGetOptions } from './use-get';

export function useGetStudentOptions(onlyId = false) {
	return useGetOptions<StudentsGetDto, StudentsGetResponse>(
		CLASS_API_PATH,
		value => value.student_name,
		onlyId ? value => value.id : undefined,
	);
}

const parseGetData = (data: StudentsGetResponses) =>
	data.map(value => {
		value.reg_date = parseDateTime(value.reg_date);
		return value;
	});

const parseGetOnlyIdData = (data: StudentsGetResponses) =>
	data.map(value => {
		return { id: value?.id, student_name: value?.student_name };
	});

export function useGetStudentComboBoxOptions(onlyId = false) {
	if (onlyId) {
		return useGet<StudentsGetDto, StudentsGetResponses>(STUDENT_API_PATH, parseGetData);
	} else {
		return useGet<StudentsGetDto, { id: number; student_name: string }[]>(
			STUDENT_API_PATH,
			parseGetOnlyIdData,
		);
	}
}
