export type ReceiptCreateDto = {
	student_id: number;
	student_name: string;
	form_id: number;
	form_name: string;
	date: Date;
	payment_year: number;
	jan: number;
	feb: number;
	mar: number;
	apr: number;
	may: number;
	jun: number;
	jul: number;
	aug: number;
	sep: number;
	oct: number;
	nov: number;
	dec: number;
	reg_fees: number;
	incentive: number;
	voucher_id?: string;
	remarks?: string;
	status?: string;
	class_ids: number[];
};