export type PackagesGetDto = {
	start_date?: Date | { lte?: Date; gte?: Date };
	end_date?: Date | { lte?: Date; gte?: Date };
	form_id?: number;
	subject_count_from?: number;
	subject_count_to?: number;
	discount_per_subject?: number;
	is_active?: boolean;
	orderBy?: string;
};

export type PackagesGetQueryDto = {
	start_date?: string;
	end_date?: string;
	form_id?: string;
	subject_count_from?: string;
	subject_count_to?: string;
	discount_per_subject?: string;
	is_active?: string;
	orderBy?: string;
};
