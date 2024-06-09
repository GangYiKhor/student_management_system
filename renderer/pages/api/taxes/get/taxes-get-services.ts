import { getToday } from '../../../../utils/dateOperations';
import { parseOrderBy } from '../../../../utils/parseOrderBy';
import prisma from '../../../../utils/prisma-client';
import { TaxesGetDto, TaxesGetQueryDto } from '../../../../utils/types/dtos/taxes/get';
import { TaxesGetResponses } from '../../../../utils/types/responses/taxes/get';

export async function taxesGetServices(
	dto: TaxesGetDto & { OR?: { [key: string]: any }[] },
): Promise<TaxesGetResponses> {
	const { orderBy: order, is_active, ...where } = dto;

	const now = getToday();
	const tomorrow = getToday();
	tomorrow.setDate(tomorrow.getDate() + 1);
	if (is_active) {
		where.start_date = { lt: tomorrow };
		where.OR = [{ end_date: { gte: now } }, { end_date: null }];
	} else if (is_active === false) {
		where.OR = [{ start_date: { gte: tomorrow } }, { end_date: { lt: now } }];
	}

	const orderBy = parseOrderBy(order, { start_date: 'desc' });
	return prisma.tax.findMany({ where, orderBy });
}

export function taxesGetParseDto(query: TaxesGetQueryDto): TaxesGetDto {
	return {
		is_active: query.is_active ? query.is_active === 'true' : undefined,
		orderBy: query.orderBy,
	};
}
