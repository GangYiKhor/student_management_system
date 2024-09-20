import { DefaultSort } from '../../components/tables/table-template';
import { CLASS_API_PATH } from '../../utils/constants/constants';
import { parseDateTime } from '../../utils/dateOperations';
import { ClassesGetResponses } from '../../utils/types/responses/classes/get';
import { EditData, FormDataType, SearchDataType } from './types';

export const PageName = 'Classes';
export const BackendPath = CLASS_API_PATH;
export const SearchFormId = 'classes-searchbar';
export const EditFormId = 'classes-edit';

export const defaultSort: DefaultSort = {
	field: 'start_time',
	asc: true,
};

export const defaultSortString: string = `${defaultSort.field} ${defaultSort.asc ? 'asc' : 'desc'}`;

export const formDefaultValue = (): FormDataType => ({
	teacher_id: { value: undefined, valid: true },
	class_name: { value: '', valid: true },
	start_date: { value: undefined, valid: true },
	end_date: { value: undefined, valid: true },
	class_year: { value: new Date().getFullYear(), valid: true },
	form_id: { value: undefined, valid: true },
	day: { value: undefined, valid: true },
	start_time: { value: undefined, valid: true },
	end_time: { value: undefined, valid: true },
	fees: { value: undefined, valid: true },
	is_package: { value: undefined, valid: true },
});

export const formDefaultValueFilled = (data: EditData): FormDataType => ({
	teacher_id: { value: data?.teacher_id, valid: true },
	class_name: { value: data?.class_name, valid: true },
	start_date: { value: data?.start_date, valid: true },
	end_date: { value: data?.end_date, valid: true },
	class_year: { value: data?.class_year, valid: true },
	form_id: { value: data?.form_id, valid: true },
	day: { value: data?.day, valid: true },
	start_time: { value: data?.start_time, valid: true },
	end_time: { value: data?.end_time, valid: true },
	fees: { value: data?.fees, valid: true },
	is_package: { value: data?.is_package, valid: true },
});

export const searchDefaultValue = (): SearchDataType => ({
	general: { value: '', valid: true },
	form_id: { value: undefined, valid: true },
	teacher_id: { value: undefined, valid: true },
	class_year: { value: new Date().getFullYear(), valid: true },
	day: { value: new Date().getDay(), valid: true },
	status: { value: true, valid: true },
});

export const parseGetData = (data: ClassesGetResponses) =>
	data.map(value => {
		value.start_date = parseDateTime(value.start_date);
		value.end_date = parseDateTime(value.end_date);
		value.start_time = parseDateTime(value.start_time);
		value.end_time = parseDateTime(value.end_time);
		return value;
	});
