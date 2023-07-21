import { PackagesCreateDto } from '../../../../dtos/packages/create';
import { ExistedError } from '../../../../utils/ExistedError';
import prisma from '../../../../utils/prisma-client';

export async function packagesCreateServices(createPackagesDto: PackagesCreateDto): Promise<void> {
	const { start_date, end_date, subject_count_from, subject_count_to, form_id } = createPackagesDto;
	const existingRecord = await prisma.package_discount.findFirst({
		where: {
			form_id,
			AND: [
				{ OR: [{ start_date: { lte: end_date } }, { end_date: { gte: start_date } }] },
				{
					OR: [
						{ subject_count_from: { gte: subject_count_to } },
						{ subject_count_to: { lte: subject_count_from } },
					],
				},
			],
		},
	});

	if (existingRecord) {
		throw new ExistedError('Duplicated Package: ' + existingRecord.id.toString());
	}
	await prisma.package_discount.create({ data: createPackagesDto });
}
