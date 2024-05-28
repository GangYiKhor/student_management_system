import prisma from '../../../../../utils/prisma-client';
import { TaxUpdateDto } from '../../../../../utils/types/dtos/taxes/update';

export async function taxUpdateServices(id: number, updateTaxDto: TaxUpdateDto): Promise<void> {
	await prisma.tax.update({ where: { id }, data: updateTaxDto });
}
