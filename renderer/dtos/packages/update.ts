export type PackagesUpdateDto = {
	start_date?: Date;
	end_date?: Date;
	form_id?: number;
	subject_count_from?: number;
	subject_count_to?: number;
	discount_per_subject?: number;
};
