import { PackagesUpdateDto } from '../../../../dtos/packages/update';
import prisma from '../../../../utils/prisma-client';

export async function packagesUpdateServices(
	id: number,
	updatePackagesDto: PackagesUpdateDto,
): Promise<void> {
	await prisma.package_discount.update({ where: { id }, data: updatePackagesDto });
}
