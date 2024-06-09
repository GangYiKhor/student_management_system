export type ClassCreateDto = {
	teacher_id: number;
	class_name: string;
	start_date: Date;
	end_date?: Date;
	class_year: number;
	form_id: number;
	day: number;
	start_time: Date;
	end_time: Date;
	fees: number;
	is_package: boolean;
};
