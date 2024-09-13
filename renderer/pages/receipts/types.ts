import { ReceiptsGetResponse } from '../../utils/types/responses/receipts/get';

export type EditData = ReceiptsGetResponse;

export type SearchDataType = {
	general: { value: string; valid: boolean };
	student_id: { value: number; valid: boolean };
	class_id: { value: number; valid: boolean };
	teacher_id: { value: number; valid: boolean };
	start_date: { value: Date; valid: boolean };
	end_date: { value: Date; valid: boolean };
	payment_year: { value: number; valid: boolean };
	payment_month: { value: number; valid: boolean };
	voucher_id: { value: string; valid: boolean };
};

export type FormDataType = {
	student: {
		value: { id: number; student_name: string; form: { id: number; form_name: string } };
		valid: boolean;
	};
	date: { value: Date; valid: boolean };
	payment_year: { value: number; valid: boolean };
	jan: { value: number; valid: boolean };
	feb: { value: number; valid: boolean };
	mar: { value: number; valid: boolean };
	apr: { value: number; valid: boolean };
	may: { value: number; valid: boolean };
	jun: { value: number; valid: boolean };
	jul: { value: number; valid: boolean };
	aug: { value: number; valid: boolean };
	sep: { value: number; valid: boolean };
	oct: { value: number; valid: boolean };
	nov: { value: number; valid: boolean };
	dec: { value: number; valid: boolean };
	reg_fees: { value: number; valid: boolean };
	incentive: { value: number; valid: boolean };
	voucher_id?: { value: string; valid: boolean };
	remarks?: { value: string; valid: boolean };
	status?: { value: string; valid: boolean };
	[key: string]: { value: any; valid: boolean };
};

export type ViewFormDataType = {
	receipt_no: { value: string; valid: boolean };
	student_id: { value: number; valid: boolean };
	student: { value: string; valid: boolean };
	date: { value: Date; valid: boolean };
	payment_year: { value: number; valid: boolean };
	jan: { value: number; valid: boolean };
	feb: { value: number; valid: boolean };
	mar: { value: number; valid: boolean };
	apr: { value: number; valid: boolean };
	may: { value: number; valid: boolean };
	jun: { value: number; valid: boolean };
	jul: { value: number; valid: boolean };
	aug: { value: number; valid: boolean };
	sep: { value: number; valid: boolean };
	oct: { value: number; valid: boolean };
	nov: { value: number; valid: boolean };
	dec: { value: number; valid: boolean };
	reg_fees: { value: number; valid: boolean };
	incentive: { value: number; valid: boolean };
	voucher_id?: { value: string; valid: boolean };
	remarks?: { value: string; valid: boolean };
	status?: { value: string; valid: boolean };
	[key: string]: { value: any; valid: boolean };
};
