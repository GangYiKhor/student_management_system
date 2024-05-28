import { ExistedError } from '../../../../utils/errors/ExistedError';
import prisma from '../../../../utils/prisma-client';
import { TaxesCreateDto } from '../../../../utils/types/dtos/taxes/create';

export async function taxesCreateServices(createTaxDto: TaxesCreateDto): Promise<void> {
	const { start_date, end_date } = createTaxDto;

	if (await prisma.tax.findFirst({ where: { end_date: null } })) {
		throw new ExistedError(
			'There is a tax ongoing, please stop the current tax (Set an end date)',
			'Tax Ongoing!',
		);
	}

	const existingRecord = await prisma.tax.findFirst({
		where: {
			start_date: { lte: end_date },
			end_date: { gte: start_date },
		},
	});

	if (existingRecord) {
		throw new ExistedError('Clashed Tax With ID: ' + existingRecord.id, 'Clashed Tax!');
	}

	await prisma.tax.create({ data: createTaxDto });
}
