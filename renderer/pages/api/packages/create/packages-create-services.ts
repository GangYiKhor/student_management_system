import { ExistedError } from '../../../../utils/errors/ExistedError';
import prisma from '../../../../utils/prisma-client';
import { PackageCreateDto } from '../../../../utils/types/dtos/packages/create';
import { PackagesCreateResponse } from '../../../../utils/types/responses/packages/create';

export async function packagesCreateServices(
	dto: PackageCreateDto,
): Promise<PackagesCreateResponse> {
	const { start_date, end_date, subject_count_from, subject_count_to, form_id } = dto;
	const existingRecord = await prisma.package_discount.findFirst({
		where: {
			form_id,
			start_date: { lte: end_date ?? undefined },
			OR: [{ end_date: { gte: start_date } }, { end_date: null }],
			subject_count_from: { lte: subject_count_to },
			subject_count_to: { gte: subject_count_from },
		},
	});

	if (existingRecord) {
		throw new ExistedError('Clashed Package: ' + existingRecord.id, 'Clashed Package!');
	}
	const result = await prisma.package_discount.create({ data: dto });
	return { id: result.id };
}
