import { DefaultSort } from '../../components/tables/table-template';
import { TAX_API_PATH } from '../../utils/constants/constants';
import { parseDateTime } from '../../utils/dateOperations';
import { TaxesGetResponses } from '../../utils/types/responses/taxes/get';
import { EditData, FormDataType, SearchDataType } from './types';

export const PageName = 'Taxes';
export const BackendPath = TAX_API_PATH;
export const SearchFormId = 'taxes-searchbar';
export const EditFormId = 'taxes-edit';

export const defaultSort: DefaultSort = {
	field: 'start_date',
	asc: false,
};

export const defaultSortString: string = `${defaultSort.field} ${defaultSort.asc ? 'asc' : 'desc'}`;

export const formDefaultValue = (): FormDataType => ({
	percentage: { value: undefined, valid: true },
	start_date: { value: undefined, valid: true },
	end_date: { value: undefined, valid: true },
	inclusive: { value: undefined, valid: true },
});

export const formDefaultValueFilled = (data: EditData): FormDataType => ({
	percentage: { value: data?.percentage, valid: true },
	start_date: { value: data?.start_date, valid: true },
	end_date: { value: data?.end_date, valid: true },
	inclusive: { value: data?.inclusive, valid: true },
});

export const searchDefaultValue = (): SearchDataType => ({
	general: { value: '', valid: true },
	status: { value: true, valid: true },
});

export const parseGetData = (data: TaxesGetResponses) =>
	data.map(value => {
		value.start_date = parseDateTime(value.start_date);
		value.end_date = parseDateTime(value.end_date);
		return value;
	});
