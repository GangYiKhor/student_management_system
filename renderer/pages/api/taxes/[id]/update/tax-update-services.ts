import { ExistedError } from '../../../../../utils/errors/ExistedError';
import prisma from '../../../../../utils/prisma-client';
import { TaxUpdateDto } from '../../../../../utils/types/dtos/taxes/update';

export async function taxUpdateServices(id: number, dto: TaxUpdateDto): Promise<void> {
	const existingRecord = await prisma.tax.findFirst({
		where: {
			id: { not: id },
			start_date: { lte: dto.end_date ?? undefined },
			end_date: { gte: dto.start_date ?? undefined },
		},
	});

	if (existingRecord) {
		throw new ExistedError('Clashed Tax With ID: ' + existingRecord.id, 'Clashed Tax!');
	}

	await prisma.tax.update({ where: { id }, data: dto });
}
