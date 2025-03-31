import { parseDateTime } from '../../../../utils/dateOperations';
import { parseOrderBy } from '../../../../utils/parseOrderBy';
import prisma from '../../../../utils/prisma-client';
import { HolidaysGetDto, HolidaysGetQueryDto } from '../../../../utils/types/dtos/holidays/get';
import { HolidaysGetResponses } from '../../../../utils/types/responses/holidays/get';

export async function holidaysGetServices(dto: HolidaysGetDto): Promise<HolidaysGetResponses> {
	const { orderBy: order, start_date, end_date } = dto;

	const where: { date?: { gte?: Date; lte?: Date } | Date } = {};

	if (start_date && end_date) {
		where.date = { gte: start_date, lte: end_date };
	} else if (start_date) {
		where.date = { gte: start_date };
	} else if (end_date) {
		where.date = { lte: end_date };
	}

	const orderBy = parseOrderBy(order, { date: 'asc' });
	return prisma.holiday.findMany({ where, orderBy });
}

export function holidaysGetParseDto(query: HolidaysGetQueryDto): HolidaysGetDto {
	return {
		start_date: parseDateTime(query.start_date),
		end_date: parseDateTime(query.end_date),
		orderBy: query.orderBy,
	};
}
