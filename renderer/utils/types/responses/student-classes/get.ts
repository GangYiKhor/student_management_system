export type StudentClassesGetResponse = {
	sequence: number;
	student_id: number;
	class: {
		id: number;
		teacher: {
			teacher_name: string;
		};
		class_name: string;
		day: number;
		fees: number;
		is_package: boolean;
	};
};

export type StudentClassesGetResponses = StudentClassesGetResponse[];
