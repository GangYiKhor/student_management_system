import { ExistedError } from '../../../../../utils/errors/ExistedError';
import prisma from '../../../../../utils/prisma-client';
import { PackageUpdateDto } from '../../../../../utils/types/dtos/packages/update';

export async function packagesUpdateServices(id: number, dto: PackageUpdateDto): Promise<void> {
	const { start_date, end_date, subject_count_from, subject_count_to, form_id } = dto;
	const existingRecord = await prisma.package_discount.findFirst({
		where: {
			form_id,
			start_date: { lte: end_date ?? undefined },
			end_date: { gte: start_date ?? undefined },
			subject_count_from: { lte: subject_count_to ?? undefined },
			subject_count_to: { gte: subject_count_from ?? undefined },
			NOT: { id },
		},
	});

	if (existingRecord) {
		throw new ExistedError('Duplicated Package: ' + existingRecord.id, 'Duplicate Package!');
	}
	await prisma.package_discount.update({ where: { id }, data: dto });
}
