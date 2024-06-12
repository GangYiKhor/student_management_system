import { DefaultSort } from '../../components/tables/table-template';
import { STUDENT_API_PATH } from '../../utils/constants/constants';
import { getToday } from '../../utils/dateOperations';
import { StudentsGetResponses } from '../../utils/types/responses/students/get';
import { EditData, FormDataType, SearchDataType } from './types';

export const PageName = 'Students';
export const BackendPath = STUDENT_API_PATH;

export const defaultSort: DefaultSort = {
	field: 'student_name',
	asc: true,
};

export const defaultSortString: string = `${defaultSort.field} ${defaultSort.asc ? 'asc' : 'desc'}`;

export const formDefaultValue: FormDataType = {
	student_name: { value: '', valid: true },
	form_id: { value: undefined, valid: true },
	reg_date: { value: getToday(), valid: true },
	reg_year: { value: new Date().getFullYear(), valid: true },
	gender: { value: '', valid: true },
	ic: { value: '', valid: true },
	school: { value: '', valid: true },
	phone_number: { value: '', valid: true },
	parent_phone_number: { value: '', valid: true },
	email: { value: '', valid: true },
	address: { value: '', valid: true },
};

export const formDefaultValueFilled = (data: EditData): FormDataType => ({
	student_name: { value: data?.student_name, valid: true },
	form_id: { value: data?.form_id, valid: true },
	reg_date: { value: data?.reg_date, valid: true },
	reg_year: { value: data?.reg_year, valid: true },
	gender: { value: data?.gender, valid: true },
	ic: { value: data?.ic, valid: true },
	school: { value: data?.school, valid: true },
	phone_number: { value: data?.phone_number, valid: true },
	parent_phone_number: { value: data?.parent_phone_number, valid: true },
	email: { value: data?.email, valid: true },
	address: { value: data?.address, valid: true },
});

export const searchDefaultValue: SearchDataType = {
	text: { value: '', valid: true },
	form_id: { value: undefined, valid: true },
	reg_date_start: { value: undefined, valid: true },
	reg_date_end: { value: undefined, valid: true },
	reg_year: { value: new Date().getFullYear(), valid: true },
	status: { value: true, valid: true },
};

export const parseGetData = (data: StudentsGetResponses) =>
	data.map(value => {
		value.reg_date = new Date(value.reg_date);
		return value;
	});
