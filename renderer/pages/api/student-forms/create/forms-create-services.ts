import { ExistedError } from '../../../../utils/errors/ExistedError';
import prisma from '../../../../utils/prisma-client';
import { StudentFormCreateDto } from '../../../../utils/types/dtos/student-forms/create';

export async function formsCreateServices(dto: StudentFormCreateDto): Promise<void> {
	const existingRecord = await prisma.form.findFirst({
		where: dto,
	});

	if (existingRecord) {
		throw new ExistedError(
			'Duplicated Student Forms: ' + existingRecord.id,
			'Duplicate Student Forms!',
		);
	}

	await prisma.form.create({ data: { ...dto, is_active: true } });
}
