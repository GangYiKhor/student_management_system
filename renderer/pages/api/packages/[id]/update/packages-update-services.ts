import { ExistedError } from '../../../../../utils/errors/ExistedError';
import prisma from '../../../../../utils/prisma-client';
import { PackageUpdateDto } from '../../../../../utils/types/dtos/packages/update';

export async function packagesUpdateServices(
	id: number,
	updatePackagesDto: PackageUpdateDto,
): Promise<void> {
	const { start_date, end_date, subject_count_from, subject_count_to, form_id } = updatePackagesDto;
	const existingRecord = await prisma.package_discount.findFirst({
		where: {
			form_id,
			start_date: { lte: end_date },
			end_date: { gte: start_date },
			subject_count_from: { lte: subject_count_to },
			subject_count_to: { gte: subject_count_from },
			NOT: { id },
		},
	});

	if (existingRecord) {
		throw new ExistedError('Duplicated Package: ' + existingRecord.id, 'Duplicate Package!');
	}
	await prisma.package_discount.update({ where: { id }, data: updatePackagesDto });
}
