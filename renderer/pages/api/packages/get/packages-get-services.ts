import { PackagesGetDto } from '../../../../dtos/packages/get';
import { PackagesGetResponse } from '../../../../responses/packages/get';
import prisma from '../../../../utils/prisma-client';

export async function packagesGetServices(
	getPackagesDto: PackagesGetDto,
): Promise<PackagesGetResponse[]> {
	const { orderBy: order, is_active, ...where } = getPackagesDto;

	if (is_active) {
		const now = new Date();
		where.start_date = { lte: now };
		where.end_date = { gte: now };
	}

	let orderBy: { [key: string]: string } | { [key: string]: { [key: string]: string } } = {
		[order.split(' ')[0]]: order.split(' ')[1] !== 'desc' ? 'asc' : 'desc',
	};
	if (order.split(' ')[0] === 'form_name') {
		orderBy = { form: orderBy };
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
