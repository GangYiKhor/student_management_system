import { QueryType } from '../../queryType';

export type StudentsGetDto = {
	search_text?: string;
	form_id?: number;
	reg_date?: Date | { gte?: Date; lte?: Date };
	reg_date_start?: Date;
	reg_date_end?: Date;
	reg_year?: number;
	is_active?: boolean;
	orderBy?: string;
};

export type StudentsGetQueryDto = QueryType<StudentsGetDto>;
