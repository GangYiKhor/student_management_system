export type HolidaysGetDto = {
	startDate?: Date;
	endDate?: Date;
	orderBy?: 'date asc' | 'date desc';
};

export type HolidaysGetQueryDto = {
	startDate?: string;
	endDate?: string;
	orderBy?: 'date asc' | 'date desc';
};
