import { parseDateOrUndefined } from '../../../../utils/parsers';
import prisma from '../../../../utils/prisma-client';
import { HolidaysGetDto, HolidaysGetQueryDto } from '../../../../utils/types/dtos/holidays/get';
import { OrderBy } from '../../../../utils/types/orderBy';
import { HolidaysGetResponses } from '../../../../utils/types/responses/holidays/get';

export async function holidaysGetServices(
	getHolidaysDto: HolidaysGetDto,
): Promise<HolidaysGetResponses> {
	const { orderBy: order, startDate, endDate } = getHolidaysDto;

	const where: { date?: { gte?: Date; lte?: Date } | Date } = {};

	if (startDate && endDate) {
		where.date = { gte: startDate, lte: endDate };
	} else if (startDate) {
		where.date = startDate;
	}

	const orderBy: OrderBy = { date: order.split(' ')[1] };
	return prisma.holiday.findMany({ where, orderBy });
}

export function holidaysGetParseDto(query: HolidaysGetQueryDto): HolidaysGetDto {
	return {
		startDate: parseDateOrUndefined(query.startDate),
		endDate: parseDateOrUndefined(query.endDate),
		orderBy: query.orderBy,
	};
}
