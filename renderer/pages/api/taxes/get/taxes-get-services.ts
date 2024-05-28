import prisma from '../../../../utils/prisma-client';
import { TaxesGetDto, TaxesGetQueryDto } from '../../../../utils/types/dtos/taxes/get';
import { OrderBy } from '../../../../utils/types/orderBy';
import { TaxesGetResponses } from '../../../../utils/types/responses/taxes/get';

export async function taxesGetServices(
	getTaxesDto: TaxesGetDto & { OR?: { [key: string]: any }[] },
): Promise<TaxesGetResponses> {
	const { orderBy: order, is_active, ...where } = getTaxesDto;

	const now = new Date();
	now.setHours(0, 0, 0, 0);
	if (is_active) {
		where.start_date = { lte: now };
		where.end_date = { gte: now };
	} else if (is_active === false) {
		where.OR = [{ start_date: { gte: now } }, { end_date: { lte: now } }];
	}

	const orderBy: OrderBy = { start_date: order.split(' ')[1] };
	return prisma.tax.findMany({ where, orderBy });
}

export function taxesGetParseDto(query: TaxesGetQueryDto): TaxesGetDto {
	return {
		is_active: query.is_active ? query.is_active === 'true' : undefined,
		orderBy: query.orderBy,
	};
}
