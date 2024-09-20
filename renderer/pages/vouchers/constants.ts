import { DefaultSort } from '../../components/tables/table-template';
import { VOUCHER_API_PATH } from '../../utils/constants/constants';
import { getToday, parseDateTime } from '../../utils/dateOperations';
import { VouchersGetResponses } from '../../utils/types/responses/vouchers/get';
import { EditData, FormDataType, SearchDataType } from './types';

export const PageName = 'Vouchers';
export const BackendPath = VOUCHER_API_PATH;
export const SearchFormId = 'vouchers-searchbar';
export const EditFormId = 'vouchers-edit';

export const defaultSort: DefaultSort = {
	field: 'start_date',
	asc: true,
};

export const defaultSortString: string = `${defaultSort.field} ${defaultSort.asc ? 'asc' : 'desc'}`;

export const formDefaultValue = (): FormDataType => ({
	id: { value: '', valid: true },
	student_id: { value: undefined, valid: true },
	discount: { value: undefined, valid: true },
	is_percentage: { value: undefined, valid: true },
	start_date: { value: getToday(), valid: true },
	expired_at: { value: undefined, valid: true },
	used: { value: false, valid: true },
	duration: { value: '', valid: true },
});

export const formDefaultValueFilled = (data: EditData): FormDataType => ({
	id: { value: data?.id ?? '', valid: true },
	student_id: { value: data?.student_id, valid: true },
	discount: { value: data?.discount, valid: true },
	is_percentage: { value: data?.is_percentage, valid: true },
	start_date: { value: data?.start_date, valid: true },
	expired_at: { value: data?.expired_at, valid: true },
	used: { value: data?.used, valid: true },
	duration: { value: '', valid: true },
});

export const searchDefaultValue = (): SearchDataType => ({
	general: { value: '', valid: true },
	student_search_id: { value: undefined, valid: true },
	status: { value: true, valid: true },
});

export const parseGetData = (data: VouchersGetResponses) =>
	data.map(value => {
		value.start_date = parseDateTime(value.start_date);
		value.expired_at = parseDateTime(value.expired_at);
		return value;
	});
