import { PackagesGetResponse } from '../../../../../responses/packages/get';
import prisma from '../../../../../utils/prisma-client';

export async function packagesGetSingleServices(id: number): Promise<PackagesGetResponse> {
	return await prisma.package_discount.findFirst({ include: { form: true }, where: { id } });
}
