import { parseOrderBy } from '../../../../utils/parseOrderBy';
import prisma from '../../../../utils/prisma-client';
import {
	StudentFormsGetDto,
	StudentFormsQueryDto,
} from '../../../../utils/types/dtos/student-forms/get';
import { StudentFormsGetResponses } from '../../../../utils/types/responses/student-forms/get';

export async function formsGetServices(dto: StudentFormsGetDto): Promise<StudentFormsGetResponses> {
	const { orderBy: order, ...where } = dto;
	const orderBy = parseOrderBy(order, { form_name: 'asc' });
	return prisma.form.findMany({ where, orderBy });
}

export function formsGetParseDto(query: StudentFormsQueryDto): StudentFormsGetDto {
	return {
		is_active: query.is_active ? query.is_active === 'true' : undefined,
		orderBy: query.orderBy,
	};
}
