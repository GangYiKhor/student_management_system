import { DefaultSort } from '../../components/tables/table-template';
import { CLASS_COUNT, RECEIPT_API_PATH } from '../../utils/constants/constants';
import { getToday, parseDateTime } from '../../utils/dateOperations';
import { ReceiptsGetResponses } from '../../utils/types/responses/receipts/get';
import { EditData, FormDataType, SearchDataType, ViewFormDataType } from './types';

export const PageName = 'Receipts';
export const BackendPath = RECEIPT_API_PATH;
export const PrintPreviewSize = 'width=700px,height=535px';
export const SearchFormId = 'receipts-searchbar';
export const CreateFormId = 'receipts-create';
export const EditFormId = 'receipts-edit';

export const defaultSort: DefaultSort = {
	field: 'id',
	asc: true,
};

export const defaultSortString: string = `${defaultSort.field} ${defaultSort.asc ? 'asc' : 'desc'}`;

export const formDefaultValue = (): FormDataType => ({
	student: { value: undefined, valid: true },
	date: { value: getToday(), valid: true },
	payment_year: { value: new Date().getFullYear(), valid: true },
	jan: { value: new Date().getMonth() === 0 ? 1 : 0, valid: true },
	feb: { value: new Date().getMonth() === 1 ? 1 : 0, valid: true },
	mar: { value: new Date().getMonth() === 2 ? 1 : 0, valid: true },
	apr: { value: new Date().getMonth() === 3 ? 1 : 0, valid: true },
	may: { value: new Date().getMonth() === 4 ? 1 : 0, valid: true },
	jun: { value: new Date().getMonth() === 5 ? 1 : 0, valid: true },
	jul: { value: new Date().getMonth() === 6 ? 1 : 0, valid: true },
	aug: { value: new Date().getMonth() === 7 ? 1 : 0, valid: true },
	sep: { value: new Date().getMonth() === 8 ? 1 : 0, valid: true },
	oct: { value: new Date().getMonth() === 9 ? 1 : 0, valid: true },
	nov: { value: new Date().getMonth() === 10 ? 1 : 0, valid: true },
	dec: { value: new Date().getMonth() === 11 ? 1 : 0, valid: true },
	reg_fees: { value: undefined, valid: true },
	incentive: { value: undefined, valid: true },
	voucher_id: { value: '', valid: true },
	remarks: { value: '', valid: true },
	status: { value: '', valid: true },
});

export const viewFormValue = (data: EditData): ViewFormDataType => {
	const formData = {
		receipt_no: { value: data?.receipt_no, valid: true },
		student_id: { value: data?.student_id, valid: true },
		student: { value: `${data?.student_name} (${data?.form_name})`, valid: true },
		date: { value: data?.date, valid: true },
		payment_year: { value: data?.payment_year, valid: true },
		jan: { value: data?.jan, valid: true },
		feb: { value: data?.feb, valid: true },
		mar: { value: data?.mar, valid: true },
		apr: { value: data?.apr, valid: true },
		may: { value: data?.may, valid: true },
		jun: { value: data?.jun, valid: true },
		jul: { value: data?.jul, valid: true },
		aug: { value: data?.aug, valid: true },
		sep: { value: data?.sep, valid: true },
		oct: { value: data?.oct, valid: true },
		nov: { value: data?.nov, valid: true },
		dec: { value: data?.dec, valid: true },
		reg_fees: { value: data?.reg_fees, valid: true },
		incentive: { value: data?.incentive, valid: true },
		voucher_id: { value: data?.voucher_id, valid: true },
		remarks: { value: data?.remarks, valid: true },
		status: { value: data?.status, valid: true },
	};

	for (let i = 0; i < CLASS_COUNT; i++) {
		if (data?.receipt_class?.[i]) {
			formData[`class_${i}`] = {
				value: `${data.receipt_class[i].class_name} - [${data.receipt_class[i].teacher_name}]`,
				valid: true,
			};
		} else {
			formData[`class_${i}`] = { value: '', valid: true };
		}
	}

	return formData;
};

export const searchDefaultValue = (): SearchDataType => ({
	general: { value: '', valid: true },
	student_id: { value: undefined, valid: true },
	class_id: { value: undefined, valid: true },
	teacher_id: { value: undefined, valid: true },
	start_date: { value: undefined, valid: true },
	end_date: { value: undefined, valid: true },
	payment_year: { value: undefined, valid: true },
	payment_month: { value: undefined, valid: true },
	voucher_id: { value: undefined, valid: true },
});

export const parseGetData = (data: ReceiptsGetResponses) =>
	data.map(value => {
		value.date = parseDateTime(value.date);
		return value;
	});
