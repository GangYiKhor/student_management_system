import { QueryType } from '../../queryType';

export type ClassesGetDto = {
	teacher_id?: number;
	class_name?: string;
	start_date?: Date | { lte?: Date; gte?: Date; lt?: Date; gt?: Date };
	end_date?: Date | { lte?: Date; gte?: Date; lt?: Date; gt?: Date };
	class_year?: number;
	form_id?: number;
	day?: number;
	start_time?: Date;
	end_time?: Date;
	fees?: number;
	is_package?: boolean;
	is_active?: boolean;
	orderBy?: string;
};

export type ClassesGetQueryDto = QueryType<ClassesGetDto>;
