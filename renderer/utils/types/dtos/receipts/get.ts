import { QueryType } from '../../queryType';

export type ReceiptsGetDto = {
	student_id?: number;
	class_id?: number;
	teacher_id?: number;
	start_date?: Date;
	end_date?: Date;
	payment_year?: number;
	payment_month?: number;
	voucher_id?: string;
	orderBy?: string;
	[key: string]: any;
};

export type ReceiptsGetQueryDto = QueryType<ReceiptsGetDto>;
