import { QueryType } from '../../queryType';

export type VouchersGetDto = {
	student_id?: number;
	start_date?: Date | { lte?: Date; gte?: Date; lt?: Date; gt?: Date };
	expired_at?: Date | { lte?: Date; gte?: Date; lt?: Date; gt?: Date };
	used?: boolean;
	is_active?: boolean;
	orderBy?: string;
};

export type VouchersGetQueryDto = QueryType<VouchersGetDto>;
