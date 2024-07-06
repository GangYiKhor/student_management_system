import { getUTCToday } from '../../../../utils/dateOperations';
import { parseOrderBy } from '../../../../utils/parseOrderBy';
import prisma from '../../../../utils/prisma-client';
import { PackagesGetDto, PackagesGetQueryDto } from '../../../../utils/types/dtos/packages/get';
import { PackagesGetResponses } from '../../../../utils/types/responses/packages/get';

export async function packagesGetServices(
	dto: PackagesGetDto & { OR?: { [key: string]: any }[] },
): Promise<PackagesGetResponses> {
	const { orderBy: order, subject_count, is_active, ...where } = dto;

	const today = getUTCToday();
	const tomorrow = getUTCToday();
	tomorrow.setDate(tomorrow.getDate() + 1);
	if (is_active) {
		where.start_date = { lt: tomorrow };
		where.OR = [{ end_date: { gte: today } }, { end_date: null }];
	} else if (is_active === false) {
		where.OR = [{ start_date: { gte: tomorrow } }, { end_date: { lt: today } }];
	}

	if (subject_count) {
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
		form_id: parseInt(query.form_id) || undefined,
		subject_count: parseInt(query.subject_count) || undefined,
		subject_count_from: parseInt(query.subject_count_from) || undefined,
		subject_count_to: parseInt(query.subject_count_to) || undefined,
		discount_per_subject: parseFloat(query.discount_per_subject) || undefined,
		is_active: query.is_active ? query.is_active === 'true' : undefined,
		orderBy: query.orderBy,
	};
}
