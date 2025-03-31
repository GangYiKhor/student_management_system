import { QueryType } from '../../queryType';

export type HolidaysGetDto = {
	start_date?: Date;
	end_date?: Date;
	orderBy?: string;
};

export type HolidaysGetQueryDto = QueryType<HolidaysGetDto>;
