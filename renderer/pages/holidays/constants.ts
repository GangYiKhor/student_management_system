import { DefaultSort } from '../../components/tables/table-template';
import { HOLIDAY_API_PATH } from '../../utils/constants/constants';
import { getToday, parseDateTime } from '../../utils/dateOperations';
import { HolidaysGetResponses } from '../../utils/types/responses/holidays/get';
import { EditData, FormDataType, SearchDataType } from './types';

export const PageName = 'Holidays';
export const BackendPath = HOLIDAY_API_PATH;

export const defaultSort: DefaultSort = {
	field: 'date',
	asc: true,
};

export const defaultSortString: string = `${defaultSort.field} ${defaultSort.asc ? 'asc' : 'desc'}`;

export const formDefaultValue: FormDataType = {
	date: { value: undefined, valid: true },
	description: { value: '', valid: true },
};

export const formDefaultValueFilled = (data: EditData): FormDataType => ({
	date: { value: data?.date, valid: true },
	description: { value: data?.description, valid: true },
});

export const searchDefaultValue: SearchDataType = {
	general: { value: '', valid: true },
	start_date: { value: getToday(), valid: true },
	end_date: { value: undefined, valid: true },
	period: { value: null, valid: true },
};

export const parseGetData = (data: HolidaysGetResponses) =>
	data.map(value => {
		value.date = parseDateTime(value.date);
		return value;
	});

export const periodOptions = [
	{ value: 'last-month', label: 'Last Month' },
	{ value: 'this-month', label: 'This Month' },
	{ value: 'next-month', label: 'Next Month' },
	{ value: 'this-year', label: 'This Year' },
	{ value: 'next-year', label: 'Next Year' },
	{ value: '-7', label: 'Last 7 Days' },
	{ value: '-30', label: 'Last 30 Days' },
	{ value: '-90', label: 'Last 90 Days' },
	{ value: '7', label: 'Next 7 Days' },
	{ value: '30', label: 'Next 30 Days' },
	{ value: '90', label: 'Next 90 Days' },
];
