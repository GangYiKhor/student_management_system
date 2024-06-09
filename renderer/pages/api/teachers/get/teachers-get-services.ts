import { parseDateTime } from '../../../../utils/dateOperations';
import { tryParseInt } from '../../../../utils/numberParsers';
import { parseOrderBy } from '../../../../utils/parseOrderBy';
import prisma from '../../../../utils/prisma-client';
import { TeachersGetDto, TeachersGetQueryDto } from '../../../../utils/types/dtos/teachers/get';
import { TeachersGetResponses } from '../../../../utils/types/responses/teachers/get';

export async function getTeachersServices(dto: TeachersGetDto): Promise<TeachersGetResponses> {
	const { orderBy: order, ...where } = dto;
	const orderBy = parseOrderBy(order, { teacher_name: 'asc' });
	return prisma.teacher.findMany({ where, orderBy });
}

export function getTeachersParseDto(query: TeachersGetQueryDto): TeachersGetDto {
	return {
		id: tryParseInt(query.id),
		teacher_name: query.teacher_name,
		ic: query.ic,
		phone_number: query.phone_number,
		email: query.email,
		address: query.address,
		start_date: parseDateTime(query.start_date),
		end_date: parseDateTime(query.end_date),
		is_active: query.is_active ? query.is_active === 'true' : undefined,
		orderBy: query.orderBy,
	};
}
