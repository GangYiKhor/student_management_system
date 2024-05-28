import prisma from '../../../../../utils/prisma-client';
import { PackagesGetResponse } from '../../../../../utils/types/responses/packages/get';

export async function packageGetServices(id: number): Promise<PackagesGetResponse> {
	const result = await prisma.package_discount.findFirst({
		include: { form: true },
		where: { id },
	});

	if (typeof result.start_date === 'string') {
		result.start_date = new Date(result.start_date);
	}

	if (typeof result.end_date === 'string') {
		result.end_date = new Date(result.end_date);
	}

	return result;
}
