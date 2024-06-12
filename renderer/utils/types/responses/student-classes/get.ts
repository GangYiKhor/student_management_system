export type StudentClassesGetResponse = {
	sequence: number;
	student_id: number;
	class: {
		form: {
			id: number;
			form_name: string;
		};
		teacher: {
			id: number;
			teacher_name: string;
		};
		id: number;
		start_date: Date;
		end_date: Date;
		class_year: number;
		form_id: number;
		day: number;
		start_time: Date;
		end_time: Date;
		fees: number;
		is_package: boolean;
		class_name: string;
	};
};

export type StudentClassesGetResponses = StudentClassesGetResponse[];
