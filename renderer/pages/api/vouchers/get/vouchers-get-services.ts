import { tryParseInt } from '../../../../utils/numberParsers';
import { parseOrderBy } from '../../../../utils/parseOrderBy';
import prisma from '../../../../utils/prisma-client';
import { VouchersGetDto, VouchersGetQueryDto } from '../../../../utils/types/dtos/vouchers/get';
import { VouchersGetResponses } from '../../../../utils/types/responses/vouchers/get';

export async function vouchersGetServices(
	dto: VouchersGetDto & { AND?: { [key: string]: any }[]; OR?: { [key: string]: any }[] },
): Promise<VouchersGetResponses> {
	const { orderBy: order, is_active, include_everyone, ...where } = dto;

	const now = new Date();
	if (is_active) {
		where.start_date = { lte: now };
		where.expired_at = { gte: now };
		where.used = false;
	} else if (is_active === false) {
		where.OR = [{ start_date: { gt: now } }, { expired_at: { lt: now } }, { used: true }];
	}

	const orderBy = parseOrderBy(order, { student: { student_name: 'asc' } }, [
		{ columnName: 'student_name', tableName: 'student' },
	]);

	if (where.student_id < 0) {
		where.student_id = null;
	} else if (include_everyone) {
		where.AND = [
			{ OR: [{ student_id: where.student_id }, { student_id: null }] },
			{ OR: where.OR },
		];
		where.student_id = undefined;
		where.OR = undefined;
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
		include_everyone: query.include_everyone ? query.include_everyone === 'true' : undefined,
		orderBy: query.orderBy,
	};
}
