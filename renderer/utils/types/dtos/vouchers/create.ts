export type VoucherCreateDto = {
	id: string;
	student_id?: number;
	discount: number;
	is_percentage: boolean;
	start_date: Date;
	expired_at: Date;
	used?: boolean;
};
