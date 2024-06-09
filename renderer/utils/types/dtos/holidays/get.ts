import { QueryType } from '../../queryType';

export type HolidaysGetDto = {
	startDate?: Date;
	endDate?: Date;
	orderBy?: string;
};

export type HolidaysGetQueryDto = QueryType<HolidaysGetDto>;
