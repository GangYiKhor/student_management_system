import { parseDateOrUndefined, parseIntOrUndefined } from '../../../../utils/parsers';
import prisma from '../../../../utils/prisma-client';
import { TeachersGetDto, TeachersGetQueryDto } from '../../../../utils/types/dtos/teachers/get';
import { TeachersGetResponses } from '../../../../utils/types/responses/teachers/get';

export async function getTeachersServices(dto: TeachersGetDto): Promise<TeachersGetResponses> {
	const { orderBy: order, ...where } = dto;

	const orderBy = { [order.split(' ')[0]]: order.split(' ')[1] !== 'desc' ? 'asc' : 'desc' };

	return prisma.teacher.findMany({ where, orderBy });
}

export function getTeachersParseDto(query: TeachersGetQueryDto): TeachersGetDto {
	return {
		id: parseIntOrUndefined(query.id),
		teacher_name: query.teacher_name,
		ic: query.ic,
		phone_number: query.phone_number,
		email: query.email,
		address: query.address,
		start_date: parseDateOrUndefined(query.start_date),
		end_date: parseDateOrUndefined(query.end_date),
		is_active: query.is_active ? query.is_active === 'true' : undefined,
		orderBy: query.orderBy,
	};
}
