import { QueryType } from '../../queryType';

export type StudentFormsGetDto = {
	is_active?: boolean;
	orderBy?: string;
};

export type StudentFormsQueryDto = QueryType<StudentFormsGetDto>;
