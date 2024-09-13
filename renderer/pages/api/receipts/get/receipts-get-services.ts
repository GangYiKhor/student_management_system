import { MONTH_SHORT } from '../../../../utils/constants/constants';
import { parseDateTime } from '../../../../utils/dateOperations';
import { tryParseInt } from '../../../../utils/numberParsers';
import { parseOrderBy } from '../../../../utils/parseOrderBy';
import prisma from '../../../../utils/prisma-client';
import { ReceiptsGetDto, ReceiptsGetQueryDto } from '../../../../utils/types/dtos/receipts/get';
import { ReceiptsGetResponses } from '../../../../utils/types/responses/receipts/get';

export async function receiptsGetServices(
	dto: ReceiptsGetDto & { OR?: { [key: string]: any }[] },
): Promise<ReceiptsGetResponses> {
	const {
		orderBy: order,
		class_id,
		teacher_id,
		start_date,
		end_date,
		payment_month,
		...where
	} = dto;

	if (start_date && end_date) {
		where.date = { gte: start_date, lte: end_date };
	} else if (start_date) {
		where.date = { gte: start_date };
	} else if (end_date) {
		where.date = { lte: end_date };
	}

	const classQuery: { class_id?: number; teacher_id?: number } = {};

	if (class_id) {
		classQuery.class_id = class_id;
	}

	if (teacher_id) {
		classQuery.teacher_id = teacher_id;
	}

	if (Object.keys(classQuery).length) {
		where.receipt_class = { some: classQuery };
	}

	if (MONTH_SHORT[payment_month]) {
		where[(MONTH_SHORT[payment_month] as string).toLowerCase()] = { gt: 0 };
	}

	const orderBy = parseOrderBy(order, { id: 'asc' });

	const receipts = await prisma.receipt.findMany({
		include: { receipt_class: true },
		where,
		orderBy,
	});
	for (const receipt of receipts) {
		receipt.receipt_class.sort((a, b) => a.sequence - b.sequence);
	}
	return receipts;
}

export function classGetParseDto(query: ReceiptsGetQueryDto): ReceiptsGetDto {
	return {
		student_id: tryParseInt(query.student_id),
		class_id: tryParseInt(query.class_id),
		teacher_id: tryParseInt(query.teacher_id),
		start_date: parseDateTime(query.start_date),
		end_date: parseDateTime(query.end_date),
		payment_year: tryParseInt(query.payment_year),
		payment_month: tryParseInt(query.payment_month),
		voucher_id: query.voucher_id,
		orderBy: query.orderBy,
	};
}
