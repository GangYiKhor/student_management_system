import { QueryType } from '../../queryType';

export type TaxesGetDto = {
	start_date?: Date | { lte?: Date; gte?: Date; lt?: Date; gt?: Date };
	end_date?: Date | { lte?: Date; gte?: Date; lt?: Date; gt?: Date };
	is_active?: boolean;
	orderBy?: string;
};

export type TaxesGetQueryDto = QueryType<TaxesGetDto>;
