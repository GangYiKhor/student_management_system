import { DefaultSort } from '../../components/tables/table-template';
import { TEACHER_API_PATH } from '../../utils/constants/constants';
import { EditData, FormDataType, SearchDataType } from './types';

export const PageName = 'Teachers';
export const BackendPath = TEACHER_API_PATH;

export const defaultSort: DefaultSort = {
	field: 'teacher_name',
	asc: true,
};

export const defaultSortString: string = `${defaultSort.field} ${defaultSort.asc ? 'asc' : 'desc'}`;

export const formDefaultValue = (): FormDataType => ({
	teacher_name: { value: '', valid: true },
	phone_number: { value: '', valid: true },
	ic: { value: '', valid: true },
	email: { value: '', valid: true },
	address: { value: '', valid: true },
});

export const formDefaultValueFilled = (data: EditData): FormDataType => ({
	teacher_name: { value: data?.teacher_name, valid: true },
	phone_number: { value: data?.phone_number, valid: true },
	ic: { value: data?.ic, valid: true },
	email: { value: data?.email, valid: true },
	address: { value: data?.address, valid: true },
});

export const searchDefaultValue: SearchDataType = {
	general: { value: '', valid: true },
	status: { value: true, valid: true },
};
