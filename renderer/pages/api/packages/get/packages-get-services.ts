import prisma from '../../../../utils/prisma-client';
import { PackagesGetDto, PackagesGetQueryDto } from '../../../../utils/types/dtos/packages/get';
import { OrderBy } from '../../../../utils/types/orderBy';
import { PackagesGetResponses } from '../../../../utils/types/responses/packages/get';

export async function packagesGetServices(
	getPackagesDto: PackagesGetDto & { OR?: { [key: string]: any }[] },
): Promise<PackagesGetResponses> {
	const { orderBy: order, subject_count, is_active, ...where } = getPackagesDto;

	if (is_active) {
		const now = new Date();
		where.start_date = { lte: now };
		where.end_date = { gte: now };
	} else if (is_active === false) {
		const now = new Date();
		where.OR = [{ start_date: { gte: now } }, { end_date: { lte: now } }];
	}

	if (subject_count) {
		where.subject_count_from = { lte: subject_count };
		where.subject_count_to = { gte: subject_count };
	}

	let orderBy: OrderBy = {
		[order.split(' ')[0]]: order.split(' ')[1] !== 'desc' ? 'asc' : 'desc',
	};

	if (order.split(' ')[0] === 'form_name') {
		orderBy = { form: orderBy };
	}

	if (order.split(' ')[0] !== 'subject_count_from') {
		orderBy = [orderBy, { subject_count_from: 'asc' }];
	}
	const results = await prisma.package_discount.findMany({
		include: { form: true },
		where,
		orderBy,
	});

	for (const result of results) {
		if (typeof result.start_date === 'string') {
			result.start_date = new Date(result.start_date);
		}

		if (typeof result.end_date === 'string') {
			result.end_date = new Date(result.end_date);
		}
	}

	return results;
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
