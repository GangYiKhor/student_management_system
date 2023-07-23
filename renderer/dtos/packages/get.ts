export type PackagesGetDto = {
	start_date?: Date;
	end_date?: Date;
	form_id?: number;
	subject_count_from?: number;
	subject_count_to?: number;
	discount_per_subject?: number;
	orderBy?: string;
};

export type PackagesGetQueryDto = {
	start_date?: string;
	end_date?: string;
	form_id?: string;
	subject_count_from?: string;
	subject_count_to?: string;
	discount_per_subject?: string;
	orderBy?: string;
};
