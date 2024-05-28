import prisma from '../../../../../utils/prisma-client';
import { TaxesGetResponse } from '../../../../../utils/types/responses/taxes/get';

export async function taxGetServices(id: number): Promise<TaxesGetResponse> {
	return prisma.tax.findFirst({ where: { id } });
}
