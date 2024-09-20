import { tryParseFloat, tryParseInt } from '../../../../utils/numberParsers';
import { parseOrderBy } from '../../../../utils/parseOrderBy';
import prisma from '../../../../utils/prisma-client';
import { PackagesGetDto, PackagesGetQueryDto } from '../../../../utils/types/dtos/packages/get';
import { PackagesGetResponses } from '../../../../utils/types/responses/packages/get';

export async function packagesGetServices(
	dto: PackagesGetDto & { OR?: { [key: string]: any }[] },
): Promise<PackagesGetResponses> {
	const { orderBy: order, subject_count, is_active, ...where } = dto;

	const now = new Date();
	if (is_active) {
		where.start_date = { lte: now };
		where.OR = [{ end_date: { gte: now } }, { end_date: null }];
	} else if (is_active === false) {
		where.OR = [{ start_date: { gt: now } }, { end_date: { lt: now } }];
	}

	if (typeof subject_count == 'number') {
		where.subject_count_from = { lte: subject_count };
		where.subject_count_to = { gte: subject_count };
	}

	const orderBy = parseOrderBy(order, { subject_count_from: 'asc' }, [
		{ columnName: 'form_name', tableName: 'form' },
	]);

	return await prisma.package_discount.findMany({
		include: { form: true },
		where,
		orderBy,
	});
}

export function packagesGetParseDto(query: PackagesGetQueryDto): PackagesGetDto {
	return {
		start_date: query.start_date ? new Date(query.start_date) : undefined,
		end_date: query.end_date ? new Date(query.end_date) : undefined,
		form_id: tryParseInt(query.form_id),
		subject_count: tryParseInt(query.subject_count),
		subject_count_from: tryParseInt(query.subject_count_from),
		subject_count_to: tryParseInt(query.subject_count_to),
		discount_per_subject: tryParseFloat(query.discount_per_subject),
		is_active: query.is_active ? query.is_active === 'true' : undefined,
		orderBy: query.orderBy,
	};
}
