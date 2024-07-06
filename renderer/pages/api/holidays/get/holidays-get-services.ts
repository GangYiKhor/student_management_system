import { parseDateTime } from '../../../../utils/dateOperations';
import { parseOrderBy } from '../../../../utils/parseOrderBy';
import prisma from '../../../../utils/prisma-client';
import { HolidaysGetDto, HolidaysGetQueryDto } from '../../../../utils/types/dtos/holidays/get';
import { HolidaysGetResponses } from '../../../../utils/types/responses/holidays/get';

export async function holidaysGetServices(dto: HolidaysGetDto): Promise<HolidaysGetResponses> {
	const { orderBy: order, startDate, endDate } = dto;

	const where: { date?: { gte?: Date; lte?: Date } | Date } = {};

	if (startDate && endDate) {
		where.date = { gte: startDate, lte: endDate };
	} else if (startDate) {
		where.date = { gte: startDate };
	} else if (endDate) {
		where.date = { lte: endDate };
	}

	const orderBy = parseOrderBy(order, { date: 'asc' });
	return prisma.holiday.findMany({ where, orderBy });
}

export function holidaysGetParseDto(query: HolidaysGetQueryDto): HolidaysGetDto {
	return {
		startDate: parseDateTime(query.startDate),
		endDate: parseDateTime(query.endDate),
		orderBy: query.orderBy,
	};
}
