export type PackagesGetResponse = {
	id: number;
	start_date: Date;
	end_date: Date;
	form: {
		id: number;
		form_name: string;
	};
	subject_count_from: number;
	subject_count_to: number;
	discount_per_subject: number;
};

export type PackagesGetResponses = PackagesGetResponse[];
