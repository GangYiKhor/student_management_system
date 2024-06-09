import { QueryType } from '../../queryType';

export type PackagesGetDto = {
	start_date?: Date | { lte?: Date; gte?: Date; lt?: Date; gt?: Date };
	end_date?: Date | { lte?: Date; gte?: Date; lt?: Date; gt?: Date };
	form_id?: number;
	subject_count?: number;
	subject_count_from?: number | { lte?: number; gte?: number };
	subject_count_to?: number | { lte?: number; gte?: number };
	discount_per_subject?: number;
	is_active?: boolean;
	orderBy?: string;
};

export type PackagesGetQueryDto = QueryType<PackagesGetDto>;
