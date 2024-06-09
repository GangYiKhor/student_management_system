import prisma from '../../../../../utils/prisma-client';
import { PackagesGetResponse } from '../../../../../utils/types/responses/packages/get';

export async function packageGetServices(id: number): Promise<PackagesGetResponse> {
	return await prisma.package_discount.findFirst({
		include: { form: true },
		where: { id },
	});
}
