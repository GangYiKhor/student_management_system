import { getUTCToday } from '../../../../utils/dateOperations';
import { tryParseInt } from '../../../../utils/numberParsers';
import { parseOrderBy } from '../../../../utils/parseOrderBy';
import prisma from '../../../../utils/prisma-client';
import { VouchersGetDto, VouchersGetQueryDto } from '../../../../utils/types/dtos/vouchers/get';
import { VouchersGetResponses } from '../../../../utils/types/responses/vouchers/get';

export async function vouchersGetServices(
	dto: VouchersGetDto & { OR?: { [key: string]: any }[] },
): Promise<VouchersGetResponses> {
	const { orderBy: order, is_active, ...where } = dto;

	const today = getUTCToday();
	const tomorrow = getUTCToday();
	tomorrow.setDate(tomorrow.getDate() + 1);
	if (is_active) {
		where.start_date = { lt: tomorrow };
		where.expired_at = { gte: today };
		where.used = false;
	} else if (is_active === false) {
		where.OR = [{ start_date: { gte: tomorrow } }, { expired_at: { lt: today } }, { used: true }];
	}

	const orderBy = parseOrderBy(order, { student: { student_name: 'asc' } }, [
		{ columnName: 'student_name', tableName: 'student' },
	]);

	if (where.student_id < 0) {
		where.student_id = null;
	}

	return prisma.voucher.findMany({
		include: { student: true },
		where,
		orderBy,
	});
}

export function voucherGetParseDto(query: VouchersGetQueryDto): VouchersGetDto {
	return {
		student_id: tryParseInt(query.student_id),
		is_active: query.is_active ? query.is_active === 'true' : undefined,
		orderBy: query.orderBy,
	};
}
