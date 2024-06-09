import { DefaultSort } from '../../components/tables/table-template';
import { PACKAGE_API_PATH } from '../../utils/constants/constants';
import { parseDateTime } from '../../utils/dateOperations';
import { PackagesGetResponses } from '../../utils/types/responses/packages/get';
import { EditData, FormDataType, SearchDataType } from './types';

export const PageName = 'Packages';
export const BackendPath = PACKAGE_API_PATH;

export const defaultSort: DefaultSort = {
	field: 'form_name',
	asc: true,
};

export const defaultSortString: string = `${defaultSort.field} ${defaultSort.asc ? 'asc' : 'desc'}`;

export const formDefaultValue: FormDataType = {
	form_id: { value: undefined, valid: true },
	start_date: { value: undefined, valid: true },
	end_date: { value: undefined, valid: true },
	subject_count_from: { value: undefined, valid: true },
	subject_count_to: { value: undefined, valid: true },
	discount_per_subject: { value: undefined, valid: true },
};

export const formDefaultValueFilled = (data: EditData): FormDataType => ({
	form_id: { value: data?.form_id, valid: true },
	start_date: { value: data?.start_date, valid: true },
	end_date: { value: data?.end_date, valid: true },
	subject_count_from: { value: data?.subject_count_from, valid: true },
	subject_count_to: { value: data?.subject_count_to, valid: true },
	discount_per_subject: { value: data?.discount_per_subject, valid: true },
});

export const searchDefaultValue: SearchDataType = {
	general: { value: '', valid: true },
	form_id: { value: undefined, valid: true },
	subject_count: { value: undefined, valid: true },
	status: { value: true, valid: true },
};

export const parseGetData = (data: PackagesGetResponses) =>
	data.map(value => {
		value.start_date = parseDateTime(value.start_date);
		value.end_date = parseDateTime(value.end_date);
		return value;
	});
