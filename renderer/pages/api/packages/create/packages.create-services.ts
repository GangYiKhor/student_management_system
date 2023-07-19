import { PackagesCreateDto } from '../../../../dtos/packages/create';
import prisma from '../../../../utils/prisma-client';

export async function packagesCreateServices(createPackagesDto: PackagesCreateDto): Promise<void> {
	// ! CHECK WHAT IF IN RANGE DUPLICATE??
	await prisma.package_discount.create({ data: createPackagesDto });
}
