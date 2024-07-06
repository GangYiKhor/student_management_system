export type VouchersGetResponse = {
	student: {
		id: number;
		student_name: string;
	};
	id: string;
	discount: number;
	is_percentage: boolean;
	start_date: Date;
	expired_at: Date;
	used: boolean;
};

export type VouchersGetResponses = VouchersGetResponse[];
