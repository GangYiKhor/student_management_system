import { PackagesGetDto } from '../../../../dtos/packages/get';
import { PackagesGetResponse } from '../../../../responses/packages/get';
import prisma from '../../../../utils/prisma-client';

export async function packagesGetServices(
	getPackagesDto: PackagesGetDto,
): Promise<PackagesGetResponse[]> {
	const { orderBy: order, ...where } = getPackagesDto;

	let orderBy: { [key: string]: string } | { [key: string]: { [key: string]: string } } = {
		[order.split(' ')[0]]: order.split(' ')[1] !== 'desc' ? 'asc' : 'desc',
	};
	if (order.split(' ')[0] === 'form_name') {
		orderBy = { form: orderBy };
	}

	return await prisma.package_discount.findMany({ include: { form: true }, where, orderBy });
}
