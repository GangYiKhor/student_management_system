export type TaxesGetDto = {
	start_date?: Date | { lte?: Date; gte?: Date };
	end_date?: Date | { lte?: Date; gte?: Date };
	is_active?: boolean;
	orderBy?: 'start_date asc' | 'start_date desc';
};

export type TaxesGetQueryDto = {
	is_active?: string;
	orderBy?: 'start_date asc' | 'start_date desc';
};
