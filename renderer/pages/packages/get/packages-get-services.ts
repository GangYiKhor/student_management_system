import { PackagesGetDto } from '../../../dtos/packages/get';
import { PackagesGetResponse } from '../../../responses/packages/get';
import prisma from '../../../utils/prisma-client';

export async function packagesGetServices(
	getPackagesDto: PackagesGetDto,
): Promise<PackagesGetResponse[]> {
	const { orderBy: order, ...where } = getPackagesDto;

	let orderBy = { [order.split(' ')[0]]: order.split(' ')[1] !== 'desc' ? 'asc' : 'desc' };

	return await prisma.package_discount.findMany({ include: { form: true }, where, orderBy });
}
