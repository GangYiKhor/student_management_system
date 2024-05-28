export type StudentClassesGetResponse = {
	student_id: number;
	class: {
		id: number;
		teacher: {
			teacher_name: string;
		};
		start_time: Date;
		class_name: string;
		day: number;
		fees: number;
		is_package: boolean;
	};
	sequence: number;
};

export type StudentClassesGetResponses = StudentClassesGetResponse[];
