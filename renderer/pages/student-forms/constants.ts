import { DefaultSort } from '../../components/tables/table-template';
import { STUDENT_FORM_API_PATH } from '../../utils/constants/constants';
import { EditData, FormDataType, SearchDataType } from './types';

export const PageName = 'Student Forms';
export const BackendPath = STUDENT_FORM_API_PATH;

export const defaultSort: DefaultSort = {
	field: 'form_name',
	asc: true,
};

export const defaultSortString: string = `${defaultSort.field} ${defaultSort.asc ? 'asc' : 'desc'}`;

export const formDefaultValue: FormDataType = {
	form_name: { value: '', valid: true },
};

export const formDefaultValueFilled = (data: EditData): FormDataType => ({
	form_name: { value: data?.form_name, valid: true },
});

export const searchDefaultValue: SearchDataType = {
	general: { value: '', valid: true },
	status: { value: true, valid: true },
};
