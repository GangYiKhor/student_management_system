import { ExistedError } from '../../../../../utils/errors/ExistedError';
import prisma from '../../../../../utils/prisma-client';
import { StudentFormUpdateDto } from '../../../../../utils/types/dtos/student-forms/update';

export async function studentFormUpdateServices(
	id: number,
	dto: StudentFormUpdateDto,
): Promise<void> {
	if (dto.form_name !== undefined) {
		const existingRecord = await prisma.form.findFirst({
			where: { ...dto, id: { not: id } },
		});

		if (existingRecord) {
			throw new ExistedError(
				'Duplicated Student Forms: ' + existingRecord.id,
				'Duplicate Student Forms!',
			);
		}
	}

	await prisma.form.update({ where: { id }, data: dto });
}
